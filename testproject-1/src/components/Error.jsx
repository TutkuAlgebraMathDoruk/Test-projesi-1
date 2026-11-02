import React from 'react';
import { Container, Alert } from 'reactstrap';

export default function Error() {
  return (
    <Container className="mt-5 text-center">
      <Alert color="danger">
        <h2>Giriş Başarısız!</h2>
        <p>E-posta veya şifre hatalı. Lütfen tekrar deneyin.</p>
      </Alert>
    </Container>
  );
}