// src/__tests__/product.test.ts
import { cadastrarProduto, limparDbProdutosParaTeste, getDbProdutosParaTeste } from '../services/productService';

interface Produto {
    id?: string;
    nome: string;
    codigo: string;
    quantidade: number;
    estoqueMinimo: number;
}

describe('Cadastro de Produtos', () => {
    beforeEach(() => {
        limparDbProdutosParaTeste();
    });

    test('deve cadastrar um produto com dados válidos e retornar o produto com ID', () => {
        const novoProdutoDados: Omit<Produto, 'id'> = {
            nome: 'Produto Teste A',
            codigo: 'PTA001',
            quantidade: 10,
            estoqueMinimo: 5,
        };
        const produtoCadastrado = cadastrarProduto(novoProdutoDados);
        expect(produtoCadastrado).toBeDefined();
        expect(produtoCadastrado.id).toEqual(expect.any(String));
        expect(produtoCadastrado.id?.length).toBeGreaterThan(0);
        expect(produtoCadastrado.nome).toBe(novoProdutoDados.nome);
        expect(produtoCadastrado.codigo).toBe(novoProdutoDados.codigo);
        expect(produtoCadastrado.quantidade).toBe(novoProdutoDados.quantidade);
        expect(produtoCadastrado.estoqueMinimo).toBe(novoProdutoDados.estoqueMinimo);
        const db = getDbProdutosParaTeste();
        expect(db).toHaveLength(1);
        expect(db[0]).toEqual(produtoCadastrado);
    });


    test('NÃO deve cadastrar um produto se o nome estiver faltando', () => {
        const produtoSemNome = {
            codigo: 'PSN001',
            quantidade: 10,
            estoqueMinimo: 5,
        } as any;

        expect(() => {
            cadastrarProduto(produtoSemNome);
        }).toThrow('O nome do produto é obrigatório.');
    });

    test('NÃO deve cadastrar um produto se o código estiver faltando', () => {
        const produtoSemCodigo = {
            nome: 'Produto Teste B',
            // codigo: 'PTB002', // O código está faltando
            quantidade: 20,
            estoqueMinimo: 10,
        } as any;

        expect(() => {
            cadastrarProduto(produtoSemCodigo);
        }).toThrow('O código do produto é obrigatório.');
    });

    test('Não deve cadastrar um produto se o estoque mínimo for negativo ', () => {
        const produtoComEstoqueMinimoNegativo = {
            nome: 'Produto teste C',
            codigo: 'PTC003',
            quantidade: 30,
            estoqueMinimo: -5,
        } as any;

        expect(() => {
            cadastrarProduto(produtoComEstoqueMinimoNegativo);
        }).toThrow('O estoque mínimo não pode ser negativo.');
    });
});

