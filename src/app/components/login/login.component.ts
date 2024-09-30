import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Credenciais } from 'src/app/models/credenciais';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  creds: Credenciais = {
    email: '',
    senha: ''
  }

  email = new FormControl(null, Validators.email);
  senha = new FormControl(null, Validators.minLength(3));

  constructor(
    private toast: ToastrService,
    private service: AuthService,
    private router: Router) { }

  ngOnInit(): void { }

  logar() {
    this.service.authenticate(this.creds).subscribe(
      token => {
        this.service.successfulLogin(token);
        this.router.navigate(['']);
        this.toast.success('Login realizado com sucesso');
      },
      error => {
        console.error('Erro de autenticação:', error);
        if (error.message === 'Token não encontrado na resposta') {
          this.toast.error('Falha na autenticação: Token não recebido');
        } else if (error.status === 401) {
          this.toast.error('Usuário e/ou senha inválidos');
        } else {
          this.toast.error('Erro ao realizar login. Por favor, tente novamente mais tarde.');
        }
      }
    );
  }

  validaCampos(): boolean {
    return this.email.valid && this.senha.valid
  }

}
