-- CreateTable
CREATE TABLE "Customer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date_created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_updated" DATETIME NOT NULL,
    "customer_name" TEXT NOT NULL,
    "email" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
