ALTER TYPE "token_type" ADD VALUE 'refresh_token';--> statement-breakpoint
ALTER TABLE "tokens" DROP COLUMN IF EXISTS "revoked";