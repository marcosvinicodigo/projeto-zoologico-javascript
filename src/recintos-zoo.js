/**
 * Classe que representa os recintos de um zoológico e as regras para alocar animais nos recintos.
 */
class RecintosZoo {
    /**
     * Cria uma instância de RecintosZoo, definindo os animais possíveis e os recintos disponíveis no zoológico.
     */
    constructor() {
        /**
         * Lista de animais possíveis no zoológico.
         * Cada animal contém nome, tamanho, biomas e dieta.
         * 
         * @type {Array<{nome: string, tamanho: number, biomas: string[], dieta: string}>}
         */
        this.animais_possiveis = [
            {
                nome: 'LEAO',
                tamanho: 3,
                biomas: ['SAVANA'],
                dieta: 'CARNIVORO'
            },
            {
                nome: 'LEOPARDO',
                tamanho: 2,
                biomas: ['SAVANA'],
                dieta: 'CARNIVORO'
            },
            {
                nome: 'CROCODILO',
                tamanho: 3,
                biomas: ['RIO'],
                dieta: 'CARNIVORO'
            },
            {
                nome: 'MACACO',
                tamanho: 1,
                biomas: ['SAVANA', 'FLORESTA'],
                dieta: 'HERBIVORO'
            },
            {
                nome: 'GAZELA',
                tamanho: 2,
                biomas: ['SAVANA'],
                dieta: 'HERBIVORO'
            },
            {
                nome: 'HIPOPOTAMO',
                tamanho: 4,
                biomas: ['SAVANA', 'RIO'],
                dieta: 'ONIVORO'
            }
        ];

        /**
         * Lista de recintos disponíveis no zoológico.
         * Cada recinto contém número, biomas, animais residentes, espaço total e espaço ocupado.
         * 
         * @type {Array<{numero: number, biomas: string[], animais_residentes: Array<{tipo: string, quantidade: number, dieta: string}>, espaço_total: number, espaço_ocupado: number}>}
         */
        this.recintos = [
            {
                numero: 1,
                biomas: ['SAVANA'],
                animais_residentes: [{ tipo: 'MACACO', quantidade: 3, dieta: 'HERBIVORO' }],
                espaço_total: 10,
                espaço_ocupado: 3,
            },
            {
                numero: 2,
                biomas: ['FLORESTA'],
                animais_residentes: [],
                espaço_total: 5,
                espaço_ocupado: 0,
            },
            {
                numero: 3,
                biomas: ['SAVANA', 'RIO'],
                animais_residentes: [{ tipo: 'GAZELA', quantidade: 1, dieta: 'HERBIVORO' }],
                espaço_total: 7,
                espaço_ocupado: 2,
            },
            {
                numero: 4,
                biomas: ['RIO'],
                animais_residentes: [],
                espaço_total: 8,
                espaço_ocupado: 0,
            },
            {
                numero: 5,
                biomas: ['SAVANA'],
                animais_residentes: [{ tipo: 'LEAO', quantidade: 1, dieta: 'CARNIVORO' }],
                espaço_total: 9,
                espaço_ocupado: 3,
            },
        ];
    }

    /**
     * Analisa os recintos disponíveis para determinar quais são viáveis para alocar um determinado animal em uma quantidade específica.
     * 
     * @param {string} animal - O nome do animal a ser alocado.
     * @param {number} quantidade - A quantidade de animais a serem alocados.
     * 
     * @returns {Object} Um objeto contendo o erro (se houver) ou uma lista de recintos viáveis.
     * @returns {string|null} [erro] - Mensagem de erro, se houver (ex: "Animal inválido", "Quantidade inválida").
     * @returns {string[]} [recintosViaveis] - Lista de recintos viáveis (ex: ["Recinto 1 (espaço livre: 7 total: 10)", ...]), se houver.
     */
    analisaRecintos(animal, quantidade) {
        let recintos_compativeis = [];
        let recintosViaveis = [];
        let peso_total = 0;
        let erro = null;
        
        // Verifica se o animal é válido
        let animal_valido = this.animais_possiveis.some(animal_possivel => {
            return animal_possivel.nome === animal;
        });
        // Verifica se a quantidade é válida (maior que 0)
        let quantidade_valida = quantidade > 0;
        if (quantidade_valida) {
            if (animal_valido) {
                this.animais_possiveis.forEach(animal_possivel => {
                    if (animal_possivel.nome === animal) {
                        peso_total += animal_possivel.tamanho * quantidade;

                        recintos_compativeis = this.recintos.filter(recinto => {
                            const biomaCompativel = animal_possivel.biomas.some(bioma => recinto.biomas.includes(bioma));
                            recinto.espaço_ocupado += peso_total;

                            // Verifica compatibilidade com outros animais residentes
                            let animalDiferente = false;
                            recinto.animais_residentes.forEach(animal_residente => {
                                if (animal_residente.tipo !== animal) {
                                    animalDiferente = true;
                                }
                            });

                            if (animalDiferente) {
                                recinto.espaço_ocupado += 1;
                            }
                            const espaçoSuficiente = recinto.espaço_ocupado + peso_total <= recinto.espaço_total;
                            let animalCompativel = true;

                            // Regras específicas para hipopótamos
                            if (animal_possivel.nome === 'HIPOPOTAMO') {
                                if (recinto.biomas.includes('RIO') && recinto.biomas.includes('SAVANA')) {
                                    animalCompativel = recinto.animais_residentes.every(animal_residente => {
                                        return animal_residente.dieta === 'HERBIVORO';
                                    });
                                } else {
                                    animalCompativel = recinto.animais_residentes.every(animal_residente => {
                                        return animal_residente.tipo === 'HIPOPOTAMO';
                                    });
                                }
                            } else if (animal === 'MACACO' && quantidade === 1) {
                                // Regras específicas para macacos
                                if (recinto.animais_residentes.length < 1) {
                                    animalCompativel = false;
                                } else {
                                    animalCompativel = recinto.animais_residentes.every(animal_residente => {
                                        return animal_possivel.dieta === 'HERBIVORO';
                                    });
                                }
                            } else if (animal_possivel.dieta === 'CARNIVORO' || animal_possivel.dieta === 'ONIVORO') {
                                animalCompativel = recinto.animais_residentes.every(animal_residente => {
                                    return animal_residente.dieta === animal_possivel.dieta;
                                });
                            } else if (animal_possivel.dieta === 'HERBIVORO') {
                                animalCompativel = recinto.animais_residentes.every(animal_residente => {
                                    return animal_residente.dieta === animal_possivel.dieta;
                                });
                            }

                            return biomaCompativel && espaçoSuficiente && animalCompativel;
                        });
                        
                        if (recintos_compativeis.length === 0) {
                            erro = "Não há recinto viável";
                        } else {
                            recintos_compativeis.forEach(recinto_compativel => {
                                const recinto_info = `Recinto ${recinto_compativel.numero} (espaço livre: ${recinto_compativel.espaço_total - recinto_compativel.espaço_ocupado} total: ${recinto_compativel.espaço_total})`;
                                recintosViaveis.push(recinto_info);
                            });
                        }
                    }
                });
            } else {
                erro = "Animal inválido";
            }
        } else {
            erro = "Quantidade inválida";
        }

        if (erro) {
            return { erro };
        } else {
            return { recintosViaveis };
        }
    }
}

export { RecintosZoo as RecintosZoo }; 