// src/services/productService.ts

interface Produto {
    id?: string;
    nome: string;
    codigo: string;
    quantidade: number;
    estoqueMinimo: number;
}
type DadosCadastroProduto = Partial<Omit<Produto, 'id'>> & {
    codigo?: string;
    quantidade?: number;
    estoqueMinimo?: number;
    nome?: string;
};

const dbProdutos: Produto[] = [];

export const cadastrarProduto = (dadosProduto: DadosCadastroProduto): Produto => {
    // Validação do nome
    if (!dadosProduto.nome || dadosProduto.nome.trim() === '') {
        throw new Error('O nome do produto é obrigatório.');
    }

    // ADICIONAR VALIDAÇÃO DO CÓDIGO AQUI
    if (!dadosProduto.codigo || dadosProduto.codigo.trim() === '') {
        throw new Error('O código do produto é obrigatório.');
    }

    // Se chegou aqui, nome e código são válidos.
    const novoProdutoComId: Produto = {
        nome: dadosProduto.nome,
        codigo: dadosProduto.codigo, // Usamos o código validado
        quantidade: dadosProduto.quantidade !== undefined ? dadosProduto.quantidade : 0,
        estoqueMinimo: dadosProduto.estoqueMinimo !== undefined ? dadosProduto.estoqueMinimo : 0,
        id: `id_${Math.random().toString(36).slice(2, 11)}`,
    };

    dbProdutos.push(novoProdutoComId);
    return novoProdutoComId;
};

export const limparDbProdutosParaTeste = () => {
    dbProdutos.length = 0;
};

export const getDbProdutosParaTeste = () => {
    return dbProdutos;
};
