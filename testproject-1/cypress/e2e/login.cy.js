describe('Login, Form Validasyon ve Yönlendirme Testleri', () => {
  beforeEach(() => {
    // Her testten önce ana sayfaya git
    cy.visit('http://localhost:5173');
  });

  it('1. Eksik veya hatalı formatta e-posta girildiğinde butonun disabled kaldığını test eder', () => {
    cy.get('input[name="email"]').type('gecersiz-format');
    cy.get('input[name="password"]').type('Sifre123*');
    
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('2. E-posta doğru fakat şifre kurallara uymadığında butonun disabled kaldığını test eder', () => {
    cy.get('input[name="email"]').type('doruk@test.com');
    cy.get('input[name="password"]').type('123'); // Zayıf şifre
    
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('3. E-posta yanlış formatta veya geçersizken butonun disabled kaldığını test eder', () => {
    cy.get('input[name="email"]').type('yanlisuser@test.com');
    cy.get('input[name="password"]').type('Sifre123*');
    
    // Eğer sistemde kayıtlı olmayan e-postada validasyon doğrudan engelliyorsa:
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('4. E-posta ve şifre kurallara uygun ancak yanlış/kayıtsız girildiğinde butonun aktif olup hata sayfasına yönlendirdiğini test eder', () => {
    cy.get('input[name="email"]').type('yanlisuser@test.com');
    cy.get('input[name="password"]').type('YanlisSifre123*');

    // Format kurallarına uyduğu için buton aktif olmalı ve tıklanabilmeli
    cy.get('button[type="submit"]').should('not.be.disabled').click();

    // Hatalı giriş nedeniyle /error sayfasına yönlendirildiğini doğrula
    cy.url().should('include', '/error');
  });

  it('5. Doğru e-posta ve doğru şifre girildiğinde butonun aktif olup başarıyla giriş yaptığını test eder', () => {
    cy.get('input[name="email"]').type('doruk@test.com');
    cy.get('input[name="password"]').type('Sifre123*');

    // Her iki bilgi de doğru olduğu için buton aktif olmalı ve tıklanabilmeli
    cy.get('button[type="submit"]').should('not.be.disabled').click();

    // Başarıyla /success sayfasına yönlendirildiğini doğrula
    cy.url().should('include', '/success');
    cy.contains('Tebrikler!').should('be.visible');
  });
})