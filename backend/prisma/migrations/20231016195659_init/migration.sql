/*
  Warnings:

  - You are about to drop the column `adresse_utilisateur` on the `Utilisateur` table. All the data in the column will be lost.
  - You are about to drop the column `mot_de_passe` on the `Utilisateur` table. All the data in the column will be lost.
  - You are about to drop the column `nom_utilisateur` on the `Utilisateur` table. All the data in the column will be lost.
  - You are about to drop the column `prenom_utilisateur` on the `Utilisateur` table. All the data in the column will be lost.
  - You are about to drop the column `telephone_utilisateur` on the `Utilisateur` table. All the data in the column will be lost.
  - Added the required column `adresse` to the `Utilisateur` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nom` to the `Utilisateur` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Utilisateur` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prenom` to the `Utilisateur` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telephone` to the `Utilisateur` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Utilisateur" (
    "id_client" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pseudo" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "id_vendeur" INTEGER,
    CONSTRAINT "Utilisateur_id_vendeur_fkey" FOREIGN KEY ("id_vendeur") REFERENCES "Vendeur" ("id_vendeur") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Utilisateur" ("email", "id_client", "id_vendeur", "pseudo") SELECT "email", "id_client", "id_vendeur", "pseudo" FROM "Utilisateur";
DROP TABLE "Utilisateur";
ALTER TABLE "new_Utilisateur" RENAME TO "Utilisateur";
CREATE UNIQUE INDEX "Utilisateur_pseudo_key" ON "Utilisateur"("pseudo");
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
