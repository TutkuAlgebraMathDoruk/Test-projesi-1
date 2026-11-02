import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const initialForm = {
  email: '',
  password: '',
  terms: false,
};

const initialErrors = {
  email: '',
  password: '',
  terms: '',
};

// Regex kuralları: Email formatı ve güçlü şifre
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export default function Login() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isEmailValid = emailRegex.test(form.email);
    const isPasswordValid = passwordRegex.test(form.password);
    const isTermsValid = form.terms;

    setIsValid(isEmailValid && isPasswordValid && isTermsValid);
  }, [form]);

  const handleChange = (event) => {
    let { name, value, type, checked } = event.target;
    const valueToUse = type === 'checkbox' ? checked : value;

    setForm({ ...form, [name]: valueToUse });

    if (name === 'email') {
      setErrors({
        ...errors,
        email: emailRegex.test(value) ? '' : 'Geçerli bir email adresi giriniz.',
      });
    } else if (name === 'password') {
      setErrors({
        ...errors,
        password: passwordRegex.test(value)
          ? ''
          : 'Şifre en az 8 karakter olmalı; büyük harf, küçük harf, rakam ve özel karakter içermelidir.',
      });
    } else if (name === 'terms') {
      setErrors({
        ...errors,
        terms: checked ? '' : 'Şartları kabul etmelisiniz.',
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValid) return;

    // Kendi MockAPI adresimiz `/login` endpoint'i ile çağrılıyor:
    axios
      .get('https://6ae851f61a7b15aaa50eeaa7.mockapi.io/login')
      .then((res) => {
        const user = res.data.find(
          (item) => item.password === form.password && item.email === form.email
        );
        if (user) {
          setForm(initialForm);
          navigate('/success');
        } else {
          navigate('/error');
        }
      })
      .catch(() => {
        navigate('/error');
      });
  };

  return (
    <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
      <h3 className="mb-4 text-center">Giriş Yap</h3>

      <FormGroup>
        <Label for="email">Email</Label>
        <Input
          id="email"
          name="email"
          placeholder="Örn: test@example.com"
          type="email"
          onChange={handleChange}
          value={form.email}
          invalid={errors.email !== '' && form.email !== ''}
          data-testid="email-input"
        />
        <FormFeedback>{errors.email}</FormFeedback>
      </FormGroup>

      <FormGroup>
        <Label for="password">Şifre</Label>
        <Input
          id="password"
          name="password"
          placeholder="Güçlü bir şifre girin"
          type="password"
          onChange={handleChange}
          value={form.password}
          invalid={errors.password !== '' && form.password !== ''}
          data-testid="password-input"
        />
        <FormFeedback>{errors.password}</FormFeedback>
      </FormGroup>

      <FormGroup check className="mb-3">
        <Label check htmlFor="terms">
          <Input
            id="terms"
            name="terms"
            type="checkbox"
            onChange={handleChange}
            checked={form.terms}
            data-testid="terms-input"
          />{' '}
          Kullanım şartlarını ve gizlilik politikasını kabul ediyorum.
        </Label>
      </FormGroup>

      <Button color="primary" block disabled={!isValid} data-testid="submit-button">
        Giriş Yap
      </Button>
    </Form>
  );
}