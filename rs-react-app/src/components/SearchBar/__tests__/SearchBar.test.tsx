import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, beforeEach, afterEach, describe, test, expect } from 'vitest';
import SearchBar from '../SearchBar';

const STORAGE_KEY = 'pokemon_search_query';

const renderSearchBar = (onSearch = vi.fn()) => {
    const result = render(<SearchBar onSearch={onSearch} />);
    const input = () => screen.getByPlaceholderText('Input name...');
    const button = () => screen.getByRole('button', { name: /search/i });
    return { ...result, input, button, onSearch };
};

beforeEach(() => {
    localStorage.clear();
});

afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
});

describe('SearchBar — rendering', () => {
    test('создает поле ввода с placeholder', () => {
        renderSearchBar();
        expect(screen.getByPlaceholderText('Input name...')).toBeInTheDocument();
    });

    test('создает и отображает кнопку Search', () => {
        renderSearchBar();
        expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });

    test('input изначально пустой когда localStorage пустой', () => {
        renderSearchBar();
        expect(screen.getByPlaceholderText('Input name...')).toHaveValue('');
    });
});

describe('SearchBar — localStorage on mount', () => {
    test('читает сохранённый запрос из localStorage при монтировании', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify('pikachu'));
        renderSearchBar();
        expect(screen.getByPlaceholderText('Input name...')).toHaveValue('pikachu');
    });

    test('вызывает onSearch с сохранённым значением', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify('pikachu'));
        const { onSearch } = renderSearchBar();
        expect(onSearch).toHaveBeenCalledWith('pikachu');
    });

    test('не вызывает onSearch при загрузке если localStorage пустой', () => {
        const { onSearch } = renderSearchBar();
        expect(onSearch).not.toHaveBeenCalled();
    });
});

describe('SearchBar — user interactions', () => {
    test('обновляет значение input при вводе текста', async () => {
        const { input } = renderSearchBar();
        await userEvent.type(input(), 'bulbasaur');
        expect(input()).toHaveValue('bulbasaur');
    });

    test('вызывает onSearch с введённым значением после отправки', async () => {
        const { input, button, onSearch } = renderSearchBar();
        await userEvent.type(input(), 'charmander');
        await userEvent.click(button());
        expect(onSearch).toHaveBeenCalledWith('charmander');
        expect(onSearch).toHaveBeenCalledTimes(1);
    });

    test('обрезает пробелы перед вызовом onSearch', async () => {
        const { input, button, onSearch } = renderSearchBar();
        await userEvent.type(input(), '  squirtle  ');
        await userEvent.click(button());
        expect(onSearch).toHaveBeenCalledWith('squirtle');
    });

    test('вызывает onSearch с пустой строкой если поле пустое', async () => {
        const { button, onSearch } = renderSearchBar();
        await userEvent.click(button());
        expect(onSearch).toHaveBeenCalledWith('');
    });
});

describe('SearchBar — localStorage on submit', () => {
    test('сохраняет поисковый запрос в localStorage после сабмита', async () => {
        const { input, button } = renderSearchBar();
        await userEvent.type(input(), 'gengar');
        await userEvent.click(button());
        expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify('gengar'));
    });

    test('сохраняет trimmed значение в localStorage', async () => {
        const { input, button } = renderSearchBar();
        await userEvent.type(input(), '  eevee  ');
        await userEvent.click(button());
        expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify('eevee'));
    });
});
