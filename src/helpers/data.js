export default () => {
  let information = {
    "barber": {
      "intro":
        [
          "Olá, eu sou a Bruna, assistente virtual da Barbearia Silva . ",
          "Auxiliarei você no agendamento, será fácil e rápido."
        ],
      "positive_exit":
        [
          "Terminamos este agendamento.",
          "Muito obrigado",
          "Assistente saiu da conversa."
        ],
      "negative_exit":
        [
          "Que pena, deixamos para uma próxima hora então.",
          "Obrigado pela sua atenção.",
          "Assistente saiu da conversa."
        ],
      "placeholder_exit":
        "Você concluiu seu agendamento, agora pode fechar o chat e deixar o resto com a gente.",
      "placeholder_negative":
        "E uma pena que não podemos continuar, aguardamos o seu retorno",
      "questions":
        [
          {
            "content": "O que você deseja?",
            "type": "button",
            "options": [
              {
                "value": "no",
                "text": "Cancelar",
                "report_exit": true
              },
              {
                "value": "yes",
                "text": "Agendar",
                "report_exit": false
              }
            ]
          },
          {
            "content": "Informe seu nome completo, por favor.",
            "type": "text",
          },
          {
            "content": "Informe seu numero de celular, por favor.",
            "type": "text",
            "size": "10",
            "sub_type": "tel",
            "placeholder": "00000-0000"
          },
          {
            "content": "Escolha o serviço desejado:",
            "type": "select",
            "multipleselect": false,
            "options": [
              {
                "value": "cut_social",
                "text": "Corte social",
                "subquery": {
                  "content": "Escolha o profissional:",
                  "type": "select",
                  "multipleselect": false,
                  "options": [
                    {
                      "value": "joaozinho",
                      "text": "Mestre joão",
                    },
                    {
                      "value": "ricardinho",
                      "text": "Mestre Ricardo",
                    }
                  ]
                }
              },
              {
                "value": "cut_old_school",
                "text": "Corte Old School",
                "subquery": {
                  "content": "Escolha o profissional:",
                  "type": "select",
                  "multipleselect": false,
                  "options": [
                    {
                      "value": "joaozinho",
                      "text": "Mestre joão",
                    },
                    {
                      "value": "ricardinho",
                      "text": "Mestre Ricardo",
                    }
                  ]
                }
              },
              {
                "value": "cut_xpto",
                "text": "Corte XPTO",
                "subquery": {
                  "content": "Escolha o profissional:",
                  "type": "select",
                  "multipleselect": false,
                  "options": [
                    {
                      "value": "joaozinho",
                      "text": "Mestre joão",
                    },
                    {
                      "value": "ricardinho",
                      "text": "Mestre Ricardo",
                    }
                  ]
                }
              }
            ]
          },
          {
            "content": "Escolha a data desejada:",
            "type": "date",
            "sub_type": "date",
          }

        ]
    }
  }

  return {...information.barber}


}




