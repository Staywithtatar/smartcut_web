// Input Validation using Zod
// Validates and sanitizes all user inputs

import { z } from 'zod';

// File upload validation
export const FileUploadSchema = z.object({
    filename: z.string().min(1).max(255),
    contentType: z.string().regex(/^video\/(mp4|quicktime|x-msvideo|x-matroska|webm)$/),
    size: z.number().int().positive().max(500 * 1024 * 1024), // 500MB max
});

// Timestamp validation (must be positive)
const TimestampSchema = z.number().min(0).finite();

// Zoom effect validation
export const ZoomEffectSchema = z.object({
    intensity: z.enum(['subtle', 'medium', 'strong']).default('medium'),
    easing: z.enum(['linear', 'ease-in', 'ease-out', 'ease-in-out']).default('ease-in-out'),
    duration: z.number().min(0.1).max(5.0).default(1.0),
});

// Blur effect validation
export const BlurEffectSchema = z.object({
    intensity: z.enum(['light', 'medium', 'strong']).default('medium'),
    feather: z.number().min(0).max(50).default(10),
});

// Jump cut validation
export const JumpCutSchema = z.object({
    start: TimestampSchema,
    end: TimestampSchema,
    reason: z.string().max(500).optional(),
    type: z.enum(['silence', 'filler', 'mistake', 'manual']).default('manual'),
}).refine(data => data.end > data.start, {
    message: "End time must be after start time",
});

// Highlight validation
export const HighlightSchema = z.object({
    start: TimestampSchema,
    end: TimestampSchema,
    reason: z.string().max(500).optional(),
    effects: z.object({
        zoom: ZoomEffectSchema.optional(),
        blur: BlurEffectSchema.optional(),
    }).optional(),
}).refine(data => data.end > data.start, {
    message: "End time must be after start time",
});

// Transition validation
export const TransitionSchema = z.object({
    at: TimestampSchema,
    type: z.enum(['fade', 'dissolve', 'wipe', 'slide']).default('fade'),
    duration: z.number().min(0.1).max(3.0).default(0.5),
});

// Audio segment validation
export const AudioSegmentSchema = z.object({
    start: TimestampSchema,
    end: TimestampSchema,
    volume: z.number().min(0).max(2.0).default(1.0),
    fadeIn: z.number().min(0).max(5.0).optional(),
    fadeOut: z.number().min(0).max(5.0).optional(),
}).refine(data => data.end > data.start, {
    message: "End time must be after start time",
});

// Subtitle segment validation
export const SubtitleSegmentSchema = z.object({
    start: TimestampSchema,
    end: TimestampSchema,
    text: z.string().min(1).max(500),
}).refine(data => data.end > data.start, {
    message: "End time must be after start time",
});

// Subtitle style validation
export const SubtitleStyleSchema = z.object({
    font: z.string().max(100).default('Arial Black'),
    fontSize: z.number().int().min(10).max(200).default(48),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#FFFFFF'),
    outlineColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#000000'),
    outlineWidth: z.number().int().min(0).max(20).default(3),
    position: z.enum(['top', 'center', 'bottom']).default('bottom'),
    bold: z.boolean().default(true),
    italic: z.boolean().default(false),
    highlightKeywords: z.boolean().default(true),
    keywords: z.array(z.string().max(100)).max(50).default([]),
});

// Color grading validation
export const ColorGradingSchema = z.object({
    preset: z.enum(['vibrant', 'cinematic', 'natural', 'vintage', 'cool', 'warm']).default('vibrant'),
    intensity: z.number().min(0).max(1.0).default(0.8),
});

// Aspect ratio validation
export const AspectRatioSchema = z.object({
    target: z.enum(['9:16', '16:9', '1:1', '4:5']).default('9:16'),
    strategy: z.enum(['crop', 'blur-background', 'letterbox']).default('blur-background'),
});

// Audio config validation
export const AudioConfigSchema = z.object({
    normalize: z.boolean().default(true),
    targetLoudness: z.number().min(-30).max(0).default(-16),
    segments: z.array(AudioSegmentSchema).max(1000).default([]),
    removeNoise: z.boolean().default(true),
    enhanceVoice: z.boolean().default(true),
});

// Visual config validation
export const VisualConfigSchema = z.object({
    colorGrading: ColorGradingSchema.default({ preset: 'vibrant', intensity: 0.8 }),
    aspectRatio: AspectRatioSchema.default({ target: '9:16', strategy: 'blur-background' }),
    fps: z.number().int().min(15).max(60).default(30),
    resolution: z.enum(['720p', '1080p', '4k']).default('1080p'),
});

// Subtitle config validation
export const SubtitleConfigSchema = z.object({
    enabled: z.boolean().default(true),
    style: SubtitleStyleSchema.default({ font: 'Arial Black', fontSize: 48, color: '#FFFFFF', outlineColor: '#000000', outlineWidth: 3, position: 'bottom', bold: true, italic: false, highlightKeywords: true, keywords: [] }),
    segments: z.array(SubtitleSegmentSchema).max(5000).default([]),
    autoPosition: z.boolean().default(false),
});

// Timeline validation
export const TimelineSchema = z.object({
    cuts: z.array(JumpCutSchema).max(500).default([]),
    highlights: z.array(HighlightSchema).max(100).default([]),
    transitions: z.array(TransitionSchema).max(200).default([]),
});

// Metadata validation
export const MetadataSchema = z.object({
    contentType: z.enum(['vlog', 'tutorial', 'interview', 'presentation', 'gaming', 'other']).default('vlog'),
    topic: z.string().max(500).default(''),
    mood: z.enum(['energetic', 'calm', 'professional', 'casual', 'dramatic']).default('casual'),
    pacing: z.enum(['slow', 'medium', 'fast']).default('medium'),
    targetAudience: z.enum(['general', 'professional', 'young-adults', 'teens', 'educational']).default('general'),
});

// Main editing script validation
export const EditingScriptSchema = z.object({
    job_id: z.string().uuid('Invalid job ID format'),
    metadata: MetadataSchema.default({
        contentType: 'vlog',
        topic: '',
        mood: 'casual',
        pacing: 'medium',
        targetAudience: 'general',
    }),
    timeline: TimelineSchema.default({
        cuts: [],
        highlights: [],
        transitions: [],
    }),
    audio: AudioConfigSchema.default({
        normalize: true,
        targetLoudness: -16,
        segments: [],
        removeNoise: true,
        enhanceVoice: true,
    }),
    visual: VisualConfigSchema.default({
        colorGrading: { preset: 'vibrant', intensity: 0.8 },
        aspectRatio: { target: '9:16', strategy: 'blur-background' },
        fps: 30,
        resolution: '1080p',
    }),
    subtitles: SubtitleConfigSchema.default({
        enabled: true,
        style: {
            font: 'Arial Black',
            fontSize: 48,
            color: '#FFFFFF',
            outlineColor: '#000000',
            outlineWidth: 3,
            position: 'bottom',
            bold: true,
            italic: false,
            highlightKeywords: true,
            keywords: [],
        },
        segments: [],
        autoPosition: false,
    }),
    version: z.string().default('1.0'),
});

// Job creation validation
export const JobCreateSchema = z.object({
    userId: z.string().uuid('Invalid user ID'),
    videoUrl: z.string().url('Invalid video URL'),
    options: z.object({
        contentType: z.string().max(50).optional(),
        customSettings: z.record(z.unknown()).optional(),
    }).optional(),
});

// Export types
export type FileUpload = z.infer<typeof FileUploadSchema>;
export type JumpCut = z.infer<typeof JumpCutSchema>;
export type Highlight = z.infer<typeof HighlightSchema>;
export type Transition = z.infer<typeof TransitionSchema>;
export type AudioSegment = z.infer<typeof AudioSegmentSchema>;
export type SubtitleSegment = z.infer<typeof SubtitleSegmentSchema>;
export type SubtitleStyle = z.infer<typeof SubtitleStyleSchema>;
export type EditingScript = z.infer<typeof EditingScriptSchema>;
export type JobCreate = z.infer<typeof JobCreateSchema>;

/**
 * Validate editing script
 * @param data - Data to validate
 * @returns Validated editing script
 * @throws ZodError if validation fails
 */
export function validateEditingScript(data: unknown): EditingScript {
    return EditingScriptSchema.parse(data);
}

/**
 * Safe validation with error handling
 * @param data - Data to validate
 * @returns Object with success status and data or errors
 */
export function safeValidateEditingScript(data: unknown):
    | { success: true; data: EditingScript }
    | { success: false; errors: z.ZodError } {
    const result = EditingScriptSchema.safeParse(data);

    if (result.success) {
        return { success: true, data: result.data };
    } else {
        return { success: false, errors: result.error };
    }
}

/**
 * Validate file upload
 * @param file - File info to validate
 * @returns Validated file info
 */
export function validateFileUpload(file: unknown): FileUpload {
    return FileUploadSchema.parse(file);
}

/**
 * Sanitize user input (remove dangerous characters)
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
    return input
        .replace(/[<>]/g, '') // Remove HTML tags
        .replace(/[`${}]/g, '') // Remove template literal characters
        .trim()
        .slice(0, 10000); // Limit length
}
