// ============================================
// src/app/api/courses/[id]/modules/[moduleIndex]/lessons/route.ts
// POST - Add lesson to module
// ============================================
import { NextRequest } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Course from '@/models/Course';
import { ApiResponseBuilder } from '@/lib/utils/api-response';
import { handleApiError } from '@/lib/utils/error-handler';
import { requireTeacher } from '@/middleware/auth';
import { Types } from 'mongoose';
import { z } from 'zod';

const addLessonSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  content: z.string().optional(),
  videoUrl: z.string().url().optional(),
  duration: z.number().int().min(0).optional(),
  order: z.number().int().min(0),
  resources: z.array(
    z.object({
      title: z.string(),
      url: z.string().url(),
      type: z.string(),
    })
  ).optional(),
});

export const POST = requireTeacher(async (
  request: NextRequest,
  currentUser: any,
  { params }: { params: Promise<{ id: string; moduleIndex: string }> }  // ← Fixed: Added Promise
) => {
  try {
    await connectDB();
    
    const { id: courseId, moduleIndex: moduleIndexStr } = await params;
    const moduleIndex = parseInt(moduleIndexStr);  // ← Fixed: Convert to number
    
    // Validate moduleIndex is a valid number
    if (isNaN(moduleIndex) || moduleIndex < 0) {
      return ApiResponseBuilder.badRequest('Invalid module index');
    }
    
    if (!Types.ObjectId.isValid(courseId)) {
      return ApiResponseBuilder.badRequest('Invalid course ID');
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return ApiResponseBuilder.notFound('Course not found');
    }

    if (
      currentUser.role !== 'ADMIN' &&
      course.teacherId.toString() !== currentUser.userId
    ) {
      return ApiResponseBuilder.forbidden('Access denied');
    }

    if (!course.modules[moduleIndex]) {
      return ApiResponseBuilder.notFound('Module not found');
    }

    const body = await request.json();
    const validated = addLessonSchema.parse(body);

    // Add lesson
    course.modules[moduleIndex].lessons.push({
      title: validated.title,
      description: validated.description,
      content: validated.content,
      videoUrl: validated.videoUrl,
      duration: validated.duration,
      order: validated.order,
      resources: validated.resources || [],
    });

    await course.save();

    return ApiResponseBuilder.created(
      {
        _id: (course._id as Types.ObjectId).toString(),
        module: course.modules[moduleIndex],
      },
      'Lesson added successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
});