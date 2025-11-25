// ============================================
// src/app/api/attendance/mark/route.ts
// POST /api/attendance/mark - Quick mark single attendance
// ============================================
import { NextRequest } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Attendance, { AttendanceStatus } from '@/models/Attendance';
import Course from '@/models/Course';
import User from '@/models/User';
import Enrollment from '@/models/Enrollment';
import { ApiResponseBuilder } from '@/lib/utils/api-response';
import { handleApiError } from '@/lib/utils/error-handler';
import { requireTeacher } from '@/middleware/auth';
import { z } from 'zod';
import { Types } from 'mongoose';

const markAttendanceSchema = z.object({
  courseId: z.string().min(1),
  studentId: z.string().min(1),
  date: z.string(),
  status: z.nativeEnum(AttendanceStatus),  // ← Fixed: Use z.nativeEnum instead of z.enum
  notes: z.string().optional(),
});

export const POST = requireTeacher(async (request: NextRequest, currentUser: any) => {
  try {
    await connectDB();

    const body = await request.json();
    const validated = markAttendanceSchema.parse(body);

    // Check course access
    const course = await Course.findById(validated.courseId);
    if (!course) {
      return ApiResponseBuilder.notFound('Course not found');
    }

    if (
      currentUser.role !== 'ADMIN' &&
      course.teacherId.toString() !== currentUser.userId
    ) {
      return ApiResponseBuilder.forbidden('Access denied');
    }

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      courseId: validated.courseId,
      studentId: validated.studentId,
      status: 'ACTIVE',
    });

    if (!enrollment) {
      return ApiResponseBuilder.badRequest('Student not enrolled in this course');
    }

    const attendanceDate = new Date(validated.date);

    // Check if already marked
    const existing = await Attendance.findOne({
      courseId: validated.courseId,
      studentId: validated.studentId,
      date: {
        $gte: new Date(attendanceDate.setHours(0, 0, 0, 0)),
        $lt: new Date(attendanceDate.setHours(23, 59, 59, 999)),
      },
    });

    if (existing) {
      // Update existing
      existing.status = validated.status;
      existing.notes = validated.notes;
      existing.markedBy = new Types.ObjectId(currentUser.userId);
      await existing.save();

      return ApiResponseBuilder.success(
        {
          _id: (existing._id as Types.ObjectId).toString(),
          status: existing.status,
          date: existing.date,
        },
        'Attendance updated successfully'
      );
    }

    // Create new record
    const record = await Attendance.create({
      courseId: validated.courseId,
      studentId: validated.studentId,
      date: new Date(validated.date),
      status: validated.status,
      notes: validated.notes,
      markedBy: currentUser.userId,
    });

    return ApiResponseBuilder.created(
      {
        _id: (record._id as Types.ObjectId).toString(),
        courseId: record.courseId.toString(),
        studentId: record.studentId.toString(),
        status: record.status,
        date: record.date,
      },
      'Attendance marked successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
});