-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "completead" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "priority" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
