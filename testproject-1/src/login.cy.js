describe('Login, Form Validasyon ve Yönlendirme Testleri', () => {
  beforeEach(() => {
    // Her testten önce ana sayfaya git
    cy.visit('http://localhost:5173');
  });

  it('1. Eksik veya hatalı formatta e-posta girildiğinde butonun disabled kaldığını test eder', () => {
    cy.get('[data-testid="email-input"]').type('gecersiz-format');
    cy.get('[data-testid="password-input"]').type('Sifre123*');
    cy.get('[data-testid="terms-input"]').check(); // Şartlar işaretlenmeli
    
    cy.get('[data-testid="submit-button"]').should('be.disabled');
  });

  it('2. E-posta doğru fakat şifre kurallara uymadığında butonun disabled kaldığını test eder', () => {
    cy.get('[data-testid="email-input"]').type('doruk@test.com');
    cy.get('[data-testid="password-input"]').type('123'); // Zayıf şifre
    cy.get('[data-testid="terms-input"]').check(); // Şartlar işaretlenmeli
    
    cy.get('[data-testid="submit-button"]').should('be.disabled');
  });

  it('3. Kullanım şartları (terms) işaretlenmediğinde e-posta ve şifre doğru olsa bile butonun disabled kaldığını test eder', () => {
    cy.get('[data-testid="email-input"]').type('doruk@test.com');
    cy.get('[data-testid="password-input"]').type('Sifre123*');
    // Terms intentionally unchecked
    
    cy.get('[data-testid="submit-button"]').should('be.disabled');
  });

  it('4. E-posta ve şifre kurallara uygun, şartlar kabul edilmiş ancak yanlış/kayıtsız girildiğinde hata sayfasına yönlendirdiğini test eder', () => {
    cy.get('[data-testid="email-input"]').type('yanlisuser@test.com');
    cy.get('[data-testid="password-input"]').type('YanlisSifre123*');
    cy.get('[data-testid="terms-input"]').check(); // Şartlar işaretlenmeli

    // Tüm kurallara uyduğu için buton aktif olmalı ve tıklanabilmeli
    cy.get('[data-testid="submit-button"]').should('not.be.disabled').click();

    // Hatalı giriş nedeniyle /error sayfasına yönlendirildiğini doğrula
    cy.url().should('include', '/error');
  });

  it('5. Doğru e-posta, doğru şifre ve şartlar onaylandığında başarıyla giriş yaptığını test eder', () => {
    cy.get('[data-testid="email-input"]').type('doruk@test.com');
    cy.get('[data-testid="password-input"]').type('Sifre123*');
    cy.get('[data-testid="terms-input"]').check(); // Şartlar işaretlenmeli

    // Her bilgi doğru ve şartlar onaylı olduğu için buton aktif olmalı
    cy.get('[data-testid="submit-button"]').should('not.be.disabled').click();

    // Başarıyla /success sayfasına yönlendirildiğini doğrula
    cy.url().should('include', '/success');
    cy.contains('Tebrikler!').should('be.visible');
  });
});