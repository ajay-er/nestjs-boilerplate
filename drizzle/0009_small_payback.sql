ALTER TABLE "users" ALTER COLUMN "firstName" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "providerId" varchar;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_providerId_unique" UNIQUE("providerId");