-- CreateTable
CREATE TABLE "release_media_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "release_media_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "release_formats" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stands_for" TEXT,
    "description" TEXT,

    CONSTRAINT "release_formats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "release_status_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "release_status_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seasons" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "seasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anime" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title_romaji" TEXT,
    "title_english" TEXT,
    "title_native" TEXT,
    "release_media_type_id" INTEGER,
    "release_format_id" INTEGER,
    "release_status_type_id" INTEGER,
    "source_media_type_id" INTEGER,
    "description" TEXT,
    "year" TEXT,
    "season_id" INTEGER,
    "start_date" TEXT,
    "end_date" TEXT,
    "episodes" INTEGER,
    "chapters" TEXT,
    "volumes" TEXT,
    "origin" TEXT,
    "duration" INTEGER,
    "duration_unit" TEXT,
    "synonyms" TEXT,
    "hashtag" TEXT,
    "trailer_url" TEXT,
    "picture_image_url" TEXT,
    "extra_large_cover_image_url" TEXT,
    "large_cover_image_url" TEXT,
    "medium_cover_image_url" TEXT,
    "thumbnail_image_url" TEXT,
    "banner_image_url" TEXT,
    "color_image" TEXT,
    "arithmetic_geometric_mean_score" DOUBLE PRECISION,
    "arithmetic_harmonic_mean" DOUBLE PRECISION,
    "arithmetic_mean_score" DOUBLE PRECISION,
    "geometric_mean_score" DOUBLE PRECISION,
    "harmonic_mean_score" DOUBLE PRECISION,
    "weighted_mean_score" DOUBLE PRECISION,
    "median_score" DOUBLE PRECISION,
    "mean_score" DOUBLE PRECISION,
    "popularity" INTEGER,
    "trending" INTEGER,
    "favorites" INTEGER,
    "is_licensed" BOOLEAN DEFAULT true,
    "is_adult" BOOLEAN DEFAULT false,
    "is_locked" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "anime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studios" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "favorites" INTEGER NOT NULL DEFAULT 0,
    "is_animation_studio" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "studios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anime_studio_relations" (
    "id" SERIAL NOT NULL,
    "anime_id" INTEGER NOT NULL,
    "studio_id" INTEGER NOT NULL,
    "is_main" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "anime_studio_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genres" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anime_genres" (
    "id" SERIAL NOT NULL,
    "anime_id" INTEGER NOT NULL,
    "genre_id" INTEGER NOT NULL,

    CONSTRAINT "anime_genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_sites" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "language" TEXT,

    CONSTRAINT "external_sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anime_external_site_relations" (
    "id" SERIAL NOT NULL,
    "anime_id" INTEGER NOT NULL,
    "external_site_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "anime_external_site_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relation_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "relation_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anime_relation_relations" (
    "id" SERIAL NOT NULL,
    "anime_id" INTEGER NOT NULL,
    "reference_anime_id" INTEGER NOT NULL,
    "reference_type_id" INTEGER NOT NULL,

    CONSTRAINT "anime_relation_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "tag_category_id" INTEGER,
    "is_general_spoiler" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tag_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anime_tag_relations" (
    "id" SERIAL NOT NULL,
    "anime_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "rank" INTEGER,
    "is_spoiler" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "anime_tag_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voice_actors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "name_native" TEXT,
    "large_image_url" TEXT,
    "medium_image_url" TEXT,
    "description" TEXT,
    "gender" TEXT,
    "date_of_birth" TEXT,
    "age" TEXT,
    "home_town" TEXT,
    "favorites" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "voice_actors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "characters" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "name_native" TEXT,
    "large_image_url" TEXT,
    "medium_image_url" TEXT,
    "description" TEXT,
    "gender" TEXT,
    "date_of_birth" TEXT,
    "age" TEXT,
    "home_town" TEXT,
    "favorites" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "character_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anime_characters_voice_actor_relations" (
    "id" SERIAL NOT NULL,
    "anime_id" INTEGER NOT NULL,
    "character_id" INTEGER NOT NULL,
    "character_role_id" INTEGER,
    "voice_actor_id" INTEGER NOT NULL,

    CONSTRAINT "anime_characters_voice_actor_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "name_native" TEXT,
    "large_image_url" TEXT,
    "medium_image_url" TEXT,
    "description" TEXT,
    "gender" TEXT,
    "date_of_birth" TEXT,
    "age" TEXT,
    "home_town" TEXT,
    "favorites" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "staff_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anime_staff_relations" (
    "id" SERIAL NOT NULL,
    "anime_id" INTEGER NOT NULL,
    "staff_id" INTEGER NOT NULL,
    "staff_role_id" INTEGER,
    "language" TEXT,
    "version" TEXT,
    "episodes" TEXT,
    "openings" TEXT,
    "endings" TEXT,
    "promotions" TEXT,
    "additional_info" TEXT,

    CONSTRAINT "anime_staff_relations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "release_media_types_name_key" ON "release_media_types"("name");

-- CreateIndex
CREATE INDEX "idx_release_media_types" ON "release_media_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "release_formats_name_key" ON "release_formats"("name");

-- CreateIndex
CREATE INDEX "idx_release_formats_name" ON "release_formats"("name");

-- CreateIndex
CREATE UNIQUE INDEX "release_status_types_name_key" ON "release_status_types"("name");

-- CreateIndex
CREATE INDEX "idx_release_status_types_name" ON "release_status_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "seasons_name_key" ON "seasons"("name");

-- CreateIndex
CREATE INDEX "idx_seasons_name" ON "seasons"("name");

-- CreateIndex
CREATE UNIQUE INDEX "anime_slug_key" ON "anime"("slug");

-- CreateIndex
CREATE INDEX "idx_anime_slug" ON "anime"("slug");

-- CreateIndex
CREATE INDEX "idx_anime_title_romaji" ON "anime"("title_romaji");

-- CreateIndex
CREATE UNIQUE INDEX "studios_name_key" ON "studios"("name");

-- CreateIndex
CREATE INDEX "idx_studios_name" ON "studios"("name");

-- CreateIndex
CREATE UNIQUE INDEX "genres_name_key" ON "genres"("name");

-- CreateIndex
CREATE UNIQUE INDEX "genres_slug_key" ON "genres"("slug");

-- CreateIndex
CREATE INDEX "idx_genres_name" ON "genres"("name");

-- CreateIndex
CREATE UNIQUE INDEX "external_sites_name_key" ON "external_sites"("name");

-- CreateIndex
CREATE INDEX "idx_external_sites_name" ON "external_sites"("name");

-- CreateIndex
CREATE UNIQUE INDEX "relation_types_name_key" ON "relation_types"("name");

-- CreateIndex
CREATE INDEX "idx_relation_types_name" ON "relation_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE INDEX "idx_tags_name" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tag_categories_name_key" ON "tag_categories"("name");

-- CreateIndex
CREATE INDEX "idx_tag_categories_name" ON "tag_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "voice_actors_name_key" ON "voice_actors"("name");

-- CreateIndex
CREATE INDEX "idx_voice_actors_name" ON "voice_actors"("name");

-- CreateIndex
CREATE INDEX "idx_characters_name" ON "characters"("name");

-- CreateIndex
CREATE INDEX "idx_character_roles_name" ON "character_roles"("name");

-- CreateIndex
CREATE INDEX "idx_staff_name" ON "staff"("name");

-- CreateIndex
CREATE UNIQUE INDEX "staff_roles_name_key" ON "staff_roles"("name");

-- CreateIndex
CREATE INDEX "idx_staff_roles_name" ON "staff_roles"("name");

-- AddForeignKey
ALTER TABLE "anime" ADD CONSTRAINT "anime_release_media_type_id_fkey" FOREIGN KEY ("release_media_type_id") REFERENCES "release_media_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime" ADD CONSTRAINT "anime_release_format_id_fkey" FOREIGN KEY ("release_format_id") REFERENCES "release_formats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime" ADD CONSTRAINT "anime_release_status_type_id_fkey" FOREIGN KEY ("release_status_type_id") REFERENCES "release_status_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime" ADD CONSTRAINT "anime_source_media_type_id_fkey" FOREIGN KEY ("source_media_type_id") REFERENCES "release_media_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime" ADD CONSTRAINT "anime_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_studio_relations" ADD CONSTRAINT "anime_studio_relations_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_studio_relations" ADD CONSTRAINT "anime_studio_relations_studio_id_fkey" FOREIGN KEY ("studio_id") REFERENCES "studios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_genres" ADD CONSTRAINT "anime_genres_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_genres" ADD CONSTRAINT "anime_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_external_site_relations" ADD CONSTRAINT "anime_external_site_relations_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_external_site_relations" ADD CONSTRAINT "anime_external_site_relations_external_site_id_fkey" FOREIGN KEY ("external_site_id") REFERENCES "external_sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_relation_relations" ADD CONSTRAINT "anime_relation_relations_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_relation_relations" ADD CONSTRAINT "anime_relation_relations_reference_anime_id_fkey" FOREIGN KEY ("reference_anime_id") REFERENCES "anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_relation_relations" ADD CONSTRAINT "anime_relation_relations_reference_type_id_fkey" FOREIGN KEY ("reference_type_id") REFERENCES "relation_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_tag_category_id_fkey" FOREIGN KEY ("tag_category_id") REFERENCES "tag_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_tag_relations" ADD CONSTRAINT "anime_tag_relations_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_tag_relations" ADD CONSTRAINT "anime_tag_relations_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_characters_voice_actor_relations" ADD CONSTRAINT "anime_characters_voice_actor_relations_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_characters_voice_actor_relations" ADD CONSTRAINT "anime_characters_voice_actor_relations_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_characters_voice_actor_relations" ADD CONSTRAINT "anime_characters_voice_actor_relations_character_role_id_fkey" FOREIGN KEY ("character_role_id") REFERENCES "character_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_characters_voice_actor_relations" ADD CONSTRAINT "anime_characters_voice_actor_relations_voice_actor_id_fkey" FOREIGN KEY ("voice_actor_id") REFERENCES "voice_actors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_staff_relations" ADD CONSTRAINT "anime_staff_relations_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_staff_relations" ADD CONSTRAINT "anime_staff_relations_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_staff_relations" ADD CONSTRAINT "anime_staff_relations_staff_role_id_fkey" FOREIGN KEY ("staff_role_id") REFERENCES "staff_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
