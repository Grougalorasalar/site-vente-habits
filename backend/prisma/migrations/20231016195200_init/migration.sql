/*
  Warnings:

  - You are about to drop the column `email_utilisateur` on the `Utilisateur` table. All the data in the column will be lost.
  - Added the required column `email` to the `Utilisateur` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Utilisateur" (
    "id_client" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pseudo" TEXT NOT NULL,
    "nom_utilisateur" TEXT NOT NULL,
    "prenom_utilisateur" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "adresse_utilisateur" TEXT NOT NULL,
    "telephone_utilisateur" TEXT NOT NULL,
    "id_vendeur" INTEGER,
    CONSTRAINT "Utilisateur_id_vendeur_fkey" FOREIGN KEY ("id_vendeur") REFERENCES "Vendeur" ("id_vendeur") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Utilisateur" ("adresse_utilisateur", "id_client", "id_vendeur", "mot_de_passe", "nom_utilisateur", "prenom_utilisateur", "pseudo", "telephone_utilisateur") SELECT "adresse_utilisateur", "id_client", "id_vendeur", "mot_de_passe", "nom_utilisateur", "prenom_utilisateur", "pseudo", "telephone_utilisateur" FROM "Utilisateur";
DROP TABLE "Utilisateur";
ALTER TABLE "new_Utilisateur" RENAME TO "Utilisateur";
CREATE UNIQUE INDEX "Utilisateur_pseudo_key" ON "Utilisateur"("pseudo");
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
