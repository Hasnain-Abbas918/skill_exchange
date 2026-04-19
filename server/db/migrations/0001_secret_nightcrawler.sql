CREATE TABLE "extra_session_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exchange_id" uuid NOT NULL,
	"requested_by_id" uuid NOT NULL,
	"reason" text,
	"extra_sessions" integer NOT NULL,
	"status" text DEFAULT 'pending',
	"approved_by_id" uuid,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "exchanges" DROP CONSTRAINT "exchanges_extra_requested_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "exchanges" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "requests" ADD COLUMN "estimated_days" integer;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "session_number" integer;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "is_extra" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "extra_session_requests" ADD CONSTRAINT "extra_session_requests_exchange_id_exchanges_id_fk" FOREIGN KEY ("exchange_id") REFERENCES "public"."exchanges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "extra_session_requests" ADD CONSTRAINT "extra_session_requests_requested_by_id_users_id_fk" FOREIGN KEY ("requested_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "extra_session_requests" ADD CONSTRAINT "extra_session_requests_approved_by_id_users_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchanges" DROP COLUMN "total_sessions";--> statement-breakpoint
ALTER TABLE "exchanges" DROP COLUMN "completed_sessions";--> statement-breakpoint
ALTER TABLE "exchanges" DROP COLUMN "extra_sessions_a";--> statement-breakpoint
ALTER TABLE "exchanges" DROP COLUMN "extra_sessions_b";--> statement-breakpoint
ALTER TABLE "exchanges" DROP COLUMN "extra_requested_by";--> statement-breakpoint
ALTER TABLE "exchanges" DROP COLUMN "extra_requested_count";--> statement-breakpoint
ALTER TABLE "exchanges" DROP COLUMN "skill_a_status";--> statement-breakpoint
ALTER TABLE "exchanges" DROP COLUMN "skill_b_status";