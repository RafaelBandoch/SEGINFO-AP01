# Sistema de Ocorrências Acadêmicas — Protótipo Didático

Protótipo web desenvolvido para atividade prática da disciplina **Segurança da Informação**.

O sistema simula um pequeno painel acadêmico usado para registrar, consultar e acompanhar ocorrências relacionadas a alunos. Ele foi construído com **HTML, CSS e JavaScript puro**, sem dependências externas, com o objetivo de permitir uma análise prática de decisões de segurança em uma aplicação simples.

> **Aviso importante:** este projeto é exclusivamente didático. Não insira dados reais. Não utilize este código como base para um sistema de produção.

---

## 1. Objetivo do projeto

Este sistema foi criado para apoiar uma atividade prática de análise e melhoria de segurança em aplicações web.

A proposta é que os estudantes analisem um sistema existente, compreendam suas regras de negócio, identifiquem ativos e dados relevantes, avaliem riscos e proponham melhorias de segurança coerentes com os conteúdos estudados na disciplina.

O foco da atividade não é desenvolver um sistema completo do zero, mas trabalhar sobre um protótipo já funcional, observando como decisões aparentemente simples de implementação podem afetar confidencialidade, integridade, disponibilidade, rastreabilidade, privacidade e controle de acesso.

---

## 2. Cenário do sistema

Uma instituição de ensino utiliza um painel interno para registrar ocorrências acadêmicas.

Essas ocorrências podem envolver, por exemplo:

- solicitação de revisão de nota;
- contestação de frequência;
- demanda administrativa;
- observações internas sobre o atendimento;
- priorização de casos que exigem acompanhamento.

O sistema possui três perfis de uso simulados:

- **Aluno**: representa um estudante que acessa informações acadêmicas relacionadas a ocorrências;
- **Professor**: representa um docente que acompanha ou registra ocorrências acadêmicas;
- **Administrador**: representa um usuário com atribuições mais amplas sobre o painel.

A aplicação contém dados fictícios e usuários de demonstração apenas para facilitar a atividade.

---

## 3. Tecnologias utilizadas

O projeto foi construído com tecnologias básicas de front-end:

```text
HTML5
CSS3
JavaScript puro
Armazenamento local do navegador
```

Não há uso de frameworks, bibliotecas externas, banco de dados real ou servidor de aplicação.

Essa escolha foi intencional para manter o projeto simples, fácil de publicar e fácil de modificar durante uma aula prática.

---

## 4. Estrutura de arquivos

```text
sistema-ocorrencias-inseguro/
├── index.html
├── style.css
└── app.js
```

### `index.html`

Contém a estrutura da interface:

- tela de login;
- painel do usuário autenticado;
- formulário de cadastro de ocorrência;
- área de busca;
- tabela de ocorrências;
- painel de ações rápidas;
- área de logs.

### `style.css`

Contém a aparência visual da aplicação:

- layout geral;
- cards;
- botões;
- formulários;
- tabela;
- badges;
- mensagens de aviso;
- responsividade básica.

### `app.js`

Contém a lógica da aplicação:

- usuários de demonstração;
- criação de sessão simulada;
- cadastro de ocorrências;
- listagem e busca de registros;
- alteração de status;
- exclusão de registros;
- exportação de dados;
- registro de eventos em logs;
- restauração da base inicial.

---

## 5. Regras de negócio simuladas

O sistema trabalha com a ideia de **ocorrência acadêmica**.

Cada ocorrência possui, em linhas gerais:

- identificação da ocorrência;
- nome do aluno;
- matrícula;
- dados de contato;
- tipo de ocorrência;
- prioridade;
- descrição;
- observação interna;
- status;
- usuário que criou o registro;
- data de criação.

Os principais status utilizados são:

- **Aberta**;
- **Em análise**;
- **Resolvida**.

As principais ações disponíveis no protótipo são:

- entrar no sistema com usuário de demonstração;
- registrar uma nova ocorrência;
- pesquisar ocorrências cadastradas;
- alterar o status de uma ocorrência;
- excluir uma ocorrência;
- exportar dados;
- visualizar registros de logs;
- restaurar os dados iniciais do protótipo.

Essas regras foram simplificadas para permitir que o estudante concentre a análise em segurança, privacidade, controle de acesso e rastreabilidade.

---

## 6. Sobre API e back-end

Este projeto **não possui API real** e **não possui back-end**.

Toda a aplicação roda diretamente no navegador. As operações que, em um sistema real, seriam realizadas por uma API foram simuladas em JavaScript.

Em uma arquitetura real, ações como login, criação de ocorrência, atualização de status, exclusão, consulta de logs e exportação de dados normalmente passariam por uma camada de servidor, por exemplo:

```text
POST   /login
GET    /ocorrencias
POST   /ocorrencias
PATCH  /ocorrencias/:id/status
DELETE /ocorrencias/:id
GET    /logs
POST   /exportacoes
```

Neste protótipo, essas operações existem apenas como funções locais no arquivo `app.js`.

A ausência de back-end faz parte do escopo didático da atividade. O grupo deve considerar o que é possível melhorar no front-end e o que, em um sistema real, exigiria servidor, banco de dados, autenticação centralizada, autorização no back-end, controle de sessão e infraestrutura adequada.

---

### Persistência de dados

Este projeto não utiliza banco de dados real.

Os dados manipulados pela aplicação são armazenados localmente no navegador, por meio de mecanismos do próprio front-end. Isso permite simular o funcionamento de um sistema com registros, usuários e ações, mas não representa uma persistência segura ou centralizada.

Consequências dessa escolha:

- os dados não são enviados para um servidor;
- cada navegador possui seus próprios dados;
- os dados podem ser apagados pelo usuário;
- não há controle real de integridade;
- não há auditoria confiável;
- não há autenticação ou autorização real no servidor;
- não há banco de dados protegido;
- não há backup centralizado.

Essa limitação faz parte da proposta didática da atividade. O objetivo é que os alunos analisem quais riscos surgem quando regras de negócio, dados, permissões e controles ficam concentrados apenas no front-end.

## 7. Sobre banco de dados e armazenamento

Este projeto **não utiliza banco de dados real**.

Os dados são armazenados no próprio navegador, por meio de armazenamento local, apenas para que o sistema continue funcionando durante a atividade.

No contexto deste protótipo, o armazenamento local representa uma simulação simplificada de persistência. Em um sistema real, seria necessário projetar uma camada de dados apropriada, com banco de dados, controle de acesso, backup, retenção, logs protegidos e políticas de segurança compatíveis com o tipo de informação tratada.

A base inicial é composta por registros fictícios. O botão de restauração permite voltar ao estado inicial do protótipo.

---

## 8. Segurança no escopo do protótipo

Este sistema não deve ser interpretado como uma solução segura ou completa.

Ele foi preparado para permitir uma atividade de análise crítica. Portanto, existem decisões de projeto e implementação que devem ser avaliadas pelos grupos.

Durante a atividade, os estudantes devem observar aspectos como:

- quais ativos existem no sistema;
- quais dados são tratados;
- quais dados são pessoais ou potencialmente sensíveis;
- quais perfis de usuário existem;
- quais ações cada perfil deveria poder executar;
- quais informações deveriam ser exibidas ou ocultadas;
- como o sistema registra ações relevantes;
- como a sessão é representada;
- como as operações críticas são tratadas;
- quais limites existem em uma aplicação apenas front-end.

O objetivo não é transformar este protótipo em um sistema profissional completo, mas propor melhorias coerentes, justificadas e compatíveis com os conceitos estudados.

---


## 11. Usuários de demonstração

O sistema possui usuários fictícios para fins de teste.

Eles aparecem na própria tela de login do protótipo.

Esses usuários existem apenas para permitir a navegação pela aplicação durante a atividade. Eles não representam um mecanismo real de autenticação.

---

## 12. Atividade proposta

A atividade consiste em analisar o sistema, propor melhorias e implementar parte delas no código.

O grupo deverá trabalhar em três frentes:

1. **Análise do sistema**  
   Compreender o funcionamento geral, identificar ativos, dados tratados, perfis de acesso, fluxos de informação e pontos de atenção.

2. **Implementação de melhorias**  
   Alterar o HTML, CSS e JavaScript para melhorar aspectos de segurança, privacidade, rastreabilidade, validação, controle de acesso ou clareza operacional.

3. **Justificativa técnica**  
   Explicar por que cada melhoria foi proposta, qual risco ela reduz e qual conceito da disciplina sustenta a decisão.

---

## 13. O que deve ser entregue

Cada grupo deverá entregar:

- o projeto alterado;
- uma breve descrição das mudanças realizadas;
- um relatório técnico em PDF;
- uma tabela relacionando problema identificado, risco, controle proposto e justificativa.

O relatório deverá conter, no mínimo:

1. descrição resumida do sistema;
2. identificação dos principais ativos;
3. classificação de pelo menos alguns dados ou ativos;
4. análise de riscos encontrados;
5. melhorias implementadas;
6. melhorias que dependeriam de back-end ou infraestrutura real;
7. justificativa técnica das decisões;
8. conclusão do grupo.

---

## 14. Tabela sugerida para o relatório

Use uma tabela semelhante a esta:

| Item analisado | Risco associado | Controle ou melhoria proposta | Foi implementado? | Justificativa técnica |
|---|---|---|---|---|
| 1 |  |  |  |  |
| 2 |  |  |  |  |
| 3 |  |  |  |  |
| 4 |  |  |  |  |
| 5 |  |  |  |  |

A coluna “Foi implementado?” pode ser preenchida com:

```text
Sim
Não
Parcialmente
Dependeria de back-end
Dependeria de infraestrutura
```

---

## 15. Perguntas norteadoras

Durante a análise, o grupo pode se orientar pelas seguintes perguntas:

- Quais são os ativos mais importantes do sistema?
- Quais dados exigem maior cuidado?
- Que informações deveriam ser públicas, internas, confidenciais ou restritas?
- Que ações deveriam ser permitidas para cada perfil?
- O sistema diferencia autenticação e autorização?
- Existem ações que deveriam exigir proteção adicional?
- Os logs ajudam a reconstruir o que aconteceu?
- Os dados exibidos são todos necessários para cada perfil?
- O sistema coleta mais dados do que precisa?
- O que pode ser corrigido apenas no front-end?
- O que exigiria obrigatoriamente back-end, banco de dados ou infraestrutura real?

Essas perguntas não devem ser respondidas de forma genérica. O grupo deve relacionar as respostas ao funcionamento concreto do protótipo.

---

## 16. Critérios de avaliação

A avaliação considerará:

- compreensão das regras de negócio do sistema;
- identificação adequada de ativos e dados relevantes;
- coerência entre risco identificado e controle proposto;
- qualidade das melhorias implementadas;
- clareza das justificativas técnicas;
- reconhecimento dos limites de segurança de uma aplicação front-end;
- organização do código e da entrega;
- capacidade de relacionar a prática com os conceitos estudados na disciplina.

---

## 17. Restrições da atividade

Durante a atividade:

- não use dados reais;
- não transforme o projeto em outro sistema;
- não remova funcionalidades sem justificar;
- não use bibliotecas externas sem necessidade;
- não implemente back-end, salvo se o professor autorizar;
- não copie respostas prontas de ferramentas externas sem análise própria;
- não entregue apenas alterações visuais como se fossem melhorias de segurança.

Melhorias visuais podem ser feitas, mas elas devem estar acompanhadas de melhorias funcionais, organizacionais ou de segurança.

---

## 18. Observação final

Este projeto foi construído para provocar análise crítica.

Em segurança da informação, não basta perguntar se o sistema “funciona”. É necessário perguntar:

- o que ele protege;
- de quem ele protege;
- com qual controle;
- com qual evidência;
- com qual limite;
- e com qual responsabilidade.

A entrega esperada deve demonstrar essa forma de raciocínio.
