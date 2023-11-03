-- CreateTable
CREATE TABLE "Article" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom_article" TEXT NOT NULL,
    "prix_article" REAL NOT NULL,
    "description_article" TEXT,
    "id_vendeur" INTEGER NOT NULL,
    CONSTRAINT "Article_id_vendeur_fkey" FOREIGN KEY ("id_vendeur") REFERENCES "Vendeur" ("id_vendeur") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vendeur" (
    "id_vendeur" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom_entreprise" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id_client" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pseudo" TEXT NOT NULL,
    "nom_utilisateur" TEXT NOT NULL,
    "prenom_utilisateur" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "email_utilisateur" TEXT NOT NULL,
    "adresse_utilisateur" TEXT NOT NULL,
    "telephone_utilisateur" TEXT NOT NULL,
    "id_vendeur" INTEGER,
    CONSTRAINT "Utilisateur_id_vendeur_fkey" FOREIGN KEY ("id_vendeur") REFERENCES "Vendeur" ("id_vendeur") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Taille" (
    "id_article" INTEGER NOT NULL,
    "taille" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,

    PRIMARY KEY ("id_article", "taille"),
    CONSTRAINT "Taille_id_article_fkey" FOREIGN KEY ("id_article") REFERENCES "Article" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "articleId" INTEGER NOT NULL,
    CONSTRAINT "Image_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
