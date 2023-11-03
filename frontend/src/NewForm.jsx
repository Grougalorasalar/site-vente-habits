import React from "react";
import ArticleForm from "./ArticleForm";

function NewForm() {
    return (
        <div className="min-h-screen flex items-start justify-center mt-8">
            <div className="w-full max-h-full bg-white shadow-md rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1">
                        <div className="bg-blue-200 rounded-lg p-6">
                            <h1 className="text-2xl font-bold text-gray-700 text-center">Prévisualisation</h1>
                        </div>
                    </div>
                    <div className="col-span-1">

                        {/* Ajoutez ici le contenu du formulaire */}
                        <div className="bg-gray-200 rounded-lg p-6">
                            <h1 className="text-2xl font-bold text-black-700 text-center">Formulaire</h1>
                            <div class="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-base text-black">Entrez le nom de l'article</label>
                                    <input
                                        type="text"
                                        placeholder="Nom de l'article"
                                        className="w-full input input-bordered input-primary"
                                    />
                                </div>
                                <div>
                                    <label className="text-base text-black">Entrez le prix de l'article</label>
                                    <input
                                        type="text"
                                        placeholder="Prix de l'article"
                                        className="w-full input input-bordered input-primary"
                                    />
                                </div>
                                <div>
                                    <label className="text-base text-black">Entrez la description de l'article</label>
                                    <input
                                        type="text"
                                        placeholder="Description de l'article"
                                        className="w-full input input-bordered input-primary"
                                    />
                                </div>
                                <div>
                                    <label className="text-base text-black">Genre de l'article</label>
                                    <select className="select select-bordered w-full max-w-xs">
                                        <option className="btn" value="Homme">Homme</option>
                                        <option className="btn" value="Femme">Femme</option>
                                        <option className="btn" value="Enfant">Enfant</option>
                                        <option className="btn" value="Unisexe">Unisexe</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-base text-black">Entrez la catégorie de l'article</label>
                                    <input
                                        type="text"
                                        placeholder="Catégorie de l'article"
                                        className="w-full input input-bordered input-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewForm;
