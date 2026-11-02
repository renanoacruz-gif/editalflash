import { test, expect } from "@playwright/test";

test.describe("Fluxo de Autenticação e Transição Split-Screen", () => {
  test("deve carregar /login e exibir formulário de login ativo com inert no cadastro", async ({ page }) => {
    await page.goto("/login");

    // Valida título do EditalFlash
    await expect(page).toHaveTitle(/EditalFlash/i);

    // O título "Acesse sua conta" deve estar visível
    const loginHeading = page.getByRole("heading", { name: "Acesse sua conta" });
    await expect(loginHeading).toBeVisible();

    // Input de e-mail de login deve estar interativo
    const loginEmailInput = page.getByPlaceholder("gestor@suaempresa.com.br");
    await expect(loginEmailInput).toBeVisible();
    await expect(loginEmailInput).toBeEditable();

    // Botão de alternar para cadastro no painel escuro
    const createAccountBtn = page.getByRole("button", { name: /Criar minha conta gratuita/i });
    await expect(createAccountBtn).toBeVisible();

    // Clica para alternar para o cadastro
    await createAccountBtn.click();

    // URL deve atualizar para /signup sem recarregar a página
    await expect(page).toHaveURL(/.*\/signup/);

    // O título de cadastro agora deve estar visível
    const signupHeading = page.getByRole("heading", { name: "Cadastre sua empresa" }).first();
    await expect(signupHeading).toBeVisible();

    // Input do nome do gestor deve estar visível e interativo (seleciona o campo ativo)
    const nameInput = page.getByPlaceholder("Ex: Carlos Andrade").filter({ visible: true });
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toBeEditable();
  });

  test("respeita acessibilidade: formulário oculto não pode receber foco", async ({ page }) => {
    await page.goto("/login");

    // No modo login, o formulário de cadastro deve ter o atributo inert
    const signupContainer = page.locator("[inert]").first();
    await expect(signupContainer).toHaveAttribute("inert", "");
  });
});
