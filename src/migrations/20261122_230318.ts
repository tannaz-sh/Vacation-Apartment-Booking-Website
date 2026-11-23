import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_support_topics_page" AS ENUM('all', '/', '/ferienwohnungen', '/ferienwohnungen/*', '/buchen', '/ueber-uns', '/kontakt', '/faq', '/impressum', '/datenschutz', '/buchungsbedingungen');
  CREATE TYPE "public"."enum_support_topics_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__support_topics_v_version_page" AS ENUM('all', '/', '/ferienwohnungen', '/ferienwohnungen/*', '/buchen', '/ueber-uns', '/kontakt', '/faq', '/impressum', '/datenschutz', '/buchungsbedingungen');
  CREATE TYPE "public"."enum__support_topics_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "admins_sessions" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "created_at" timestamp(3) with time zone,
    "expires_at" timestamp(3) with time zone NOT NULL
  );

  CREATE TABLE "admins" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "email" varchar NOT NULL,
    "reset_password_token" varchar,
    "reset_password_expiration" timestamp(3) with time zone,
    "salt" varchar,
    "hash" varchar,
    "reset_password_requested_at" timestamp(3) with time zone,
    "login_attempts" numeric DEFAULT 0,
    "lock_until" timestamp(3) with time zone
  );

  CREATE TABLE "support_topics_questions" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "question" varchar,
    "answer" varchar
  );

  CREATE TABLE "support_topics" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "page" "enum_support_topics_page" DEFAULT 'all',
    "section" varchar,
    "order" numeric DEFAULT 0,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_support_topics_status" DEFAULT 'draft'
  );

  CREATE TABLE "_support_topics_v_version_questions" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "question" varchar,
    "answer" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_support_topics_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar,
    "version_page" "enum__support_topics_v_version_page" DEFAULT 'all',
    "version_section" varchar,
    "version_order" numeric DEFAULT 0,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__support_topics_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE "payload_kv" (
    "id" serial PRIMARY KEY NOT NULL,
    "key" varchar NOT NULL,
    "data" jsonb NOT NULL
  );

  CREATE TABLE "payload_locked_documents" (
    "id" serial PRIMARY KEY NOT NULL,
    "global_slug" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload_locked_documents_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "admins_id" integer,
    "support_topics_id" integer
  );

  CREATE TABLE "payload_preferences" (
    "id" serial PRIMARY KEY NOT NULL,
    "key" varchar,
    "value" jsonb,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload_preferences_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "admins_id" integer
  );

  CREATE TABLE "payload_migrations" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "batch" numeric,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "admins_sessions" ADD CONSTRAINT "admins_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "support_topics_questions" ADD CONSTRAINT "support_topics_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."support_topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_support_topics_v_version_questions" ADD CONSTRAINT "_support_topics_v_version_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_support_topics_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_support_topics_v" ADD CONSTRAINT "_support_topics_v_parent_id_support_topics_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."support_topics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_support_topics_fk" FOREIGN KEY ("support_topics_id") REFERENCES "public"."support_topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "admins_sessions_order_idx" ON "admins_sessions" USING btree ("_order");
  CREATE INDEX "admins_sessions_parent_id_idx" ON "admins_sessions" USING btree ("_parent_id");
  CREATE INDEX "admins_updated_at_idx" ON "admins" USING btree ("updated_at");
  CREATE INDEX "admins_created_at_idx" ON "admins" USING btree ("created_at");
  CREATE UNIQUE INDEX "admins_email_idx" ON "admins" USING btree ("email");
  CREATE INDEX "support_topics_questions_order_idx" ON "support_topics_questions" USING btree ("_order");
  CREATE INDEX "support_topics_questions_parent_id_idx" ON "support_topics_questions" USING btree ("_parent_id");
  CREATE INDEX "support_topics_updated_at_idx" ON "support_topics" USING btree ("updated_at");
  CREATE INDEX "support_topics_created_at_idx" ON "support_topics" USING btree ("created_at");
  CREATE INDEX "support_topics__status_idx" ON "support_topics" USING btree ("_status");
  CREATE INDEX "_support_topics_v_version_questions_order_idx" ON "_support_topics_v_version_questions" USING btree ("_order");
  CREATE INDEX "_support_topics_v_version_questions_parent_id_idx" ON "_support_topics_v_version_questions" USING btree ("_parent_id");
  CREATE INDEX "_support_topics_v_parent_idx" ON "_support_topics_v" USING btree ("parent_id");
  CREATE INDEX "_support_topics_v_version_version_updated_at_idx" ON "_support_topics_v" USING btree ("version_updated_at");
  CREATE INDEX "_support_topics_v_version_version_created_at_idx" ON "_support_topics_v" USING btree ("version_created_at");
  CREATE INDEX "_support_topics_v_version_version__status_idx" ON "_support_topics_v" USING btree ("version__status");
  CREATE INDEX "_support_topics_v_created_at_idx" ON "_support_topics_v" USING btree ("created_at");
  CREATE INDEX "_support_topics_v_updated_at_idx" ON "_support_topics_v" USING btree ("updated_at");
  CREATE INDEX "_support_topics_v_latest_idx" ON "_support_topics_v" USING btree ("latest");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_admins_id_idx" ON "payload_locked_documents_rels" USING btree ("admins_id");
  CREATE INDEX "payload_locked_documents_rels_support_topics_id_idx" ON "payload_locked_documents_rels" USING btree ("support_topics_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_admins_id_idx" ON "payload_preferences_rels" USING btree ("admins_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "admins_sessions" CASCADE;
  DROP TABLE "admins" CASCADE;
  DROP TABLE "support_topics_questions" CASCADE;
  DROP TABLE "support_topics" CASCADE;
  DROP TABLE "_support_topics_v_version_questions" CASCADE;
  DROP TABLE "_support_topics_v" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_support_topics_page";
  DROP TYPE "public"."enum_support_topics_status";
  DROP TYPE "public"."enum__support_topics_v_version_page";
  DROP TYPE "public"."enum__support_topics_v_version_status";`)
}
