import { renderHook, act } from '@testing-library/react';
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { useLocalStorage } from '../useLocalStorage';

beforeEach(() => localStorage.clear());
afterEach(() => localStorage.clear());

describe('useLocalStorage', () => {
  test('возвращает initialValue если ключа нет в localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  test('читает существующее значение из localStorage', () => {
    localStorage.setItem('key', JSON.stringify('saved'));
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    expect(result.current[0]).toBe('saved');
  });

  test('обновляет состояние и сохраняет в localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', ''));
    act(() => {
      result.current[1]('new-value');
    });
    expect(result.current[0]).toBe('new-value');
    expect(localStorage.getItem('key')).toBe(JSON.stringify('new-value'));
  });

  test('работает с числами', () => {
    const { result } = renderHook(() => useLocalStorage('num', 0));
    act(() => {
      result.current[1](42);
    });
    expect(result.current[0]).toBe(42);
    expect(localStorage.getItem('num')).toBe('42');
  });

  test('возвращает initialValue при неверном JSON в localStorage', () => {
    localStorage.setItem('key', 'not-valid-json{');
    const { result } = renderHook(() => useLocalStorage('key', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });
});
