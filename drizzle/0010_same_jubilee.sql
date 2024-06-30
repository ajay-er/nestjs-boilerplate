ALTER TABLE "users" DROP CONSTRAINT "users_providerId_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "providers" jsonb[] NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "provider";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "providerId";