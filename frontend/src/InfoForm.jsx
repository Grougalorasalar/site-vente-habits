import React, { useState } from 'react';

function InfoForm() {

    return (
        <div>
            <h1 className="text-3xl font-bold">Informations Supplémentaires</h1>
            <div className="flex flex-col mt-5">
                <label className="text-xl">Sexe</label>
                <input type="text" className="border-2 border-gray-300 p-2 rounded-lg mt-1" placeholder="Sexe" />
            </div>
        </div>
    );
}

export default InfoForm;
