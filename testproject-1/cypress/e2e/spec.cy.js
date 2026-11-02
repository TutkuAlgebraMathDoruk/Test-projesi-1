describe('Login, Form Validasyon ve Yönlendirme Testleri', () => {
  beforeEach(() => {
    // MockAPI isteğini taklit ederek ağ gecikmelerini ve timeout hatalarını önle
    cy.intercept('GET', 'https://6ae851f61a7b15aaa50eeaa7.mockapi.io/login', {
      statusCode: 200,
      body: [
        { email: 'doruk@test.com', password: 'Sifre123*' }
      ]
    }).as('getUsers');

    cy.visit('http://localhost:5173');
  });

  it('1. Eksik veya hatalı formatta e-posta girildiğinde butonun disabled kaldığını test eder', () => {
    cy.get('[data-testid="email-input"]').type('gecersiz-format');
    cy.get('[data-testid="password-input"]').type('Sifre123*');
    cy.get('[data-testid="terms-input"]').check();
    
    cy.get('[data-testid="submit-button"]').should('be.disabled');
  });

  it('2. E-posta doğru fakat şifre kurallara uymadığında butonun disabled kaldığını test eder', () => {
    cy.get('[data-testid="email-input"]').type('doruk@test.com');
    cy.get('[data-testid="password-input"]').type('123'); // Zayıf şifre
    cy.get('[data-testid="terms-input"]').check();
    
    cy.get('[data-testid="submit-button"]').should('be.disabled');
  });

  it('3. Şartlar kabul edilmediğinde butonun disabled kaldığını test eder', () => {
    cy.get('[data-testid="email-input"]').type('doruk@test.com');
    cy.get('[data-testid="password-input"]').type('Sifre123*');
    // Terms onaylanmıyor

    cy.get('[data-testid="submit-button"]').should('be.disabled');
  });

  it('4. E-posta ve şifre kurallara uygun ancak kayıtsız olduğunda hata sayfasına yönlendirdiğini test eder', () => {
    cy.get('[data-testid="email-input"]').type('yanlisuser@test.com');
    cy.get('[data-testid="password-input"]').type('YanlisSifre123*');
    cy.get('[data-testid="terms-input"]').check();

    cy.get('[data-testid="submit-button"]').should('not.be.disabled').click();

    cy.wait('@getUsers');
    cy.url().should('include', '/error');
  });

  it('5. Doğru e-posta ve doğru şifre girildiğinde başarıyla giriş yaptığını test eder', () => {
    cy.get('[data-testid="email-input"]').type('doruk@test.com');
    cy.get('[data-testid="password-input"]').type('Sifre123*');
    cy.get('[data-testid="terms-input"]').check();

    cy.get('[data-testid="submit-button"]').should('not.be.disabled').click();

    cy.wait('@getUsers');
    cy.url().should('include', '/success');
    cy.contains('Tebrikler!').should('be.visible');
  });
});