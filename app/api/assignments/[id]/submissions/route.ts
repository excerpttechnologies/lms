// ============================================
// src/app/api/assignments/[id]/submissions/route.ts
// GET /api/assignments/:id/submissions - Get all submissions for assignment
// ============================================
import { NextRequest } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Assignment from '@/models/Assignment';
import Course from '@/models/Course';
import User from '@/models/User';
import Submission from '@/models/Submission';
import { ApiResponseBuilder } from '@/lib/utils/api-response';
import { handleApiError } from '@/lib/utils/error-handler';
import { requireTeacher } from '@/middleware/auth';
import { Types } from 'mongoose';

export const GET = requireTeacher(async (
  request: NextRequest,
  currentUser: any,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();

    const { id: assignmentId } = await params;

    if (!Types.ObjectId.isValid(assignmentId)) {
      return ApiResponseBuilder.badRequest('Invalid assignment ID');
    }

    const assignment = await Assignment.findById(assignmentId).populate('courseId');
    if (!assignment) {
      return ApiResponseBuilder.notFound('Assignment not found');
    }

    // Check ownership
    const course = assignment.courseId as any;
    if (
      currentUser.role !== 'ADMIN' &&
      course.teacherId.toString() !== currentUser.userId
    ) {
      return ApiResponseBuilder.forbidden('Access denied');
    }

    // Get submissions
    const submissions = await Submission.find({ assignmentId })
      .populate('studentId', 'firstName lastName email avatar')
      .sort({ submittedAt: -1 })
      .lean();

    const formattedSubmissions = submissions.map(submission => ({
      ...submission,
      _id: submission._id.toString(),
      assignmentId: submission.assignmentId.toString(),
      studentId: submission.studentId ? {
        ...(submission.studentId as any),
        _id: (submission.studentId as any)._id.toString(),
      } : null,
    }));

    return ApiResponseBuilder.success(formattedSubmissions);
  } catch (error) {
    return handleApiError(error);
  }
});