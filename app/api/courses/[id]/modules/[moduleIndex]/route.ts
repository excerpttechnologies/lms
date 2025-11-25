// ============================================
// src/app/api/courses/[id]/modules/[moduleIndex]/route.ts
// PUT /api/courses/:id/modules/:moduleIndex - Update module
// DELETE /api/courses/:id/modules/:moduleIndex - Delete module
// ============================================
import { NextRequest } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Course from '@/models/Course';
import { ApiResponseBuilder } from '@/lib/utils/api-response';
import { handleApiError } from '@/lib/utils/error-handler';
import { requireTeacher } from '@/middleware/auth';
import { Types } from 'mongoose';
import { z } from 'zod';

const updateModuleSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  order: z.number().int().min(0).optional(),
});

export const PUT = requireTeacher(async (
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
    const validated = updateModuleSchema.parse(body);

    // Update module
    if (validated.title) course.modules[moduleIndex].title = validated.title;
    if (validated.description !== undefined)
      course.modules[moduleIndex].description = validated.description;
    if (validated.order !== undefined)
      course.modules[moduleIndex].order = validated.order;

    await course.save();

    return ApiResponseBuilder.success(
      {
        _id: (course._id as Types.ObjectId).toString(),
        modules: course.modules,
      },
      'Module updated successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
});

export const DELETE = requireTeacher(async (
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

    // Remove module
    course.modules.splice(moduleIndex, 1);
    await course.save();

    return ApiResponseBuilder.success(null, 'Module deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
});