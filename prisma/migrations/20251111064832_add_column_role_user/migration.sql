-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_USER', 'ADMIN', 'MEMBER', 'USER');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "user_role" "UserRole" NOT NULL DEFAULT 'USER';
