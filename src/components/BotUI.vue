<template>
  <div>
    <!--    <img-->
    <!--      crossOrigin="anonymous"-->
    <!--      width="120px"-->
    <!--      src=""/>-->
    <div id="bot">
      <bot-ui></bot-ui>
    </div>
  </div>
</template>

<script>

    import BotUi from 'botui'
    import Vue from 'vue'
    import dataJSON from '../helpers/data'
    import '../../node_modules/botui/build/botui.min.css'
    import '../../node_modules/botui/build/botui-theme-default.css'


    export default {
        data() {
            return {
                instance: {},
                loading: false,
                content: "",
                form: {},
                response: [],
                finished: false,
                exited: false,
                delay: 1,
                robot_logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmjnjOSeOaIm5FZxZM4VSfl-78LEBP9GmQFt0thcTl6a0vtlOB',
            }
        },
        async mounted() {
            this.instance = new BotUi('bot', {
                vue: Vue
            })
            this.form = await dataJSON()
            for (const message of (this.form.intro || [])) {
                await this.showMessage(message, 2000)
            }
            await this.getQuestions(this.form.questions)

        },

        watch: {
            finished() {
                if (this.finished) {
                    let message = this.form.placeholder_exit
                    message = this.replaceVariable(message)
                    this.$router.push({name: 'ThankYou', query: {'exit-message': message}})
                }
            },
            exited() {
                if (this.exited) {
                    let message = this.form.placeholder_negative
                    message = this.replaceVariable(message)
                    this.$router.push({name: 'Exited', query: {'exit-message': message}})
                }
            }
        },

        methods: {
            showMessage(message, delay) {
                return new Promise(resolve => {
                    setTimeout(() => {
                        this.instance.message.bot({
                            photo: this.robot_logo,
                            delay: this.delay,
                            content: message
                        })
                    }, delay)
                    resolve(true)
                })
            },

            async getQuestions(questionArray) {
                const questions = Array.from(questionArray)
                let question = questions[0]

                if (!question) {
                    return this.handlerSuccessExit()
                }

                if (question.content) {
                    setTimeout(() => {
                        this.instance.message.bot({
                            photo: this.robot_logo,
                            delay: this.delay,
                            content: question.content
                        })
                    }, 2000)

                }


                setTimeout(() => {
                    if (question.type === 'button') {
                        this.buttonQuestion({
                            question,
                            questions
                        })
                    }
                    if (question.type === 'text') {
                        this.inputQuestion({
                            question,
                            questions
                        })
                    }
                    if (question.type === 'select') {
                        this.selectQuestion({
                            question,
                            questions
                        })
                    }
                    if (question.type === 'date') {
                        this.dateQuestion({
                            question,
                            questions
                        })
                    }
                }, 3000)

            },

            async buttonQuestion({question, questions}) {
                let {options, isFromBack} = question
                const currentQuestion = Array.from(questions).length
                const totalQuestion = Array.from(this.form.questions).length

                if (isFromBack !== true && currentQuestion !== totalQuestion) {
                    options = [{
                        value: 'back',
                        text: 'Voltar',
                        cssClass: 'backQuestions-class'
                    },
                        ...options
                    ]
                }
                const response = await this.instance.action.button({
                    action: options
                })

                if (response.value === 'back') {
                    await this.backQuestion({questions})
                    return
                }

                if (response.report_exit === true) {
                    await this.handleErrorExit()
                    return
                }

                questions.shift()
                if (questions.length) {
                    return this.getQuestions(questions)
                }

                this.handlerSuccessExit()


            },

            async backQuestion({questions}) {
                const currentQuestion = Array.from(questions).length
                const totalQuestion = Array.from(this.form.questions).length
                let newArray = Array.from(this.form.questions).slice(
                    Math.abs(totalQuestion - currentQuestion - 1)
                )
                newArray[0]['isFromBack'] = true
                await this.getQuestions(newArray)
            },

            async inputQuestion({questions, question}) {
                const response = await this.instance.action.text({
                    action: {
                        size: question.size || '30',
                        sub_type: question.sub_type || 'text',
                        placeholder: question.placeholder || '',
                        button: {label: 'Enviar'}
                    }
                })

                if (response.report_exit === true) {
                    await this.handleErrorExit()
                } else {
                    const otherQuestions = Array.from(questions)
                    this.response.push({value: `${response.value}`, text: `${response.value}`})
                    otherQuestions.shift()
                    this.getQuestions(otherQuestions)
                }
            },

            async selectQuestion({question, questions}) {
                const response = await this.instance.action.select({
                    action: {
                        multipleselect: question.multipleselect,
                        cssClass: 'selectQuestion',
                        placeholder: question.multipleselect ? 'Selecione opções' : 'Selecione uma opção',
                        options: question.options.map(options => {
                            return {value: options.value, text: options.text}
                        }),
                        button: {label: 'Enviar'}
                    }
                })
                let responseValue = response.value.replace(/\s/g, '').split(',')
                let otherQuestions = Array.from(questions)
                this.response.push({value: `${responseValue.join(" ")}`, text: `${response.text}`})
                otherQuestions.shift()
                question.options.forEach((option) => {
                    responseValue.forEach(response => {
                        if (option.value === response && option.subquery) {
                            otherQuestions = [option.subquery, ...otherQuestions]
                        }
                    })
                })
                await this.getQuestions(otherQuestions)

            },

            async dateQuestion({question, questions}) {
                const response = await this.instance.action.text({
                    action: {
                        size: question.size || '10',
                        sub_type: question.sub_type || 'date',
                        placeholder: question.placeholder || '',
                        button: {label: 'Enviar'}
                    }
                })

                let responseValue = response.value.replace(/\s/g, '').split(',')
                this.response.push({value: `${responseValue.join(" ")}`, text: `${responseValue.join(" ")}`})
                this.showMessage("Escolha o horário desejado:", 1000)
                setTimeout(() => {
                    this.getHours({questions}, responseValue.join(" "))
                }, 2000)

            },

            async confirmQuestion(questions) {
                const response = await this.instance.action.button({
                    action: [
                        {
                            "value": "yes",
                            "text": "Sim",
                        },
                        {
                            "value": "no",
                            "text": "Não",
                        },]
                })

                let otherQuestions = Array.from(questions)
                if (response.value === 'yes') {
                    otherQuestions.shift()
                    setTimeout(() => {
                        this.getQuestions(otherQuestions)
                    }, 1500)
                } else {
                    setTimeout(() => {
                        this.getQuestions(otherQuestions)
                    }, 1500)
                }
            },

            async finalQuestion(data) {
                this.showMessage("Vamos confirmar seu agendamento: ",1500)
                this.showMessage(`Nome: ${this.response[0].text}`,1600)
                this.showMessage(`Celular: ${this.response[1].text}`,1700)
                this.showMessage(`Serviço: ${this.response[2].text}`,1800)
                this.showMessage(`Profissional: ${this.response[3].text}`,1900)
                this.showMessage(`Data: ${this.response[4].text}`,2000)
                this.showMessage(`Horário: ${this.response[5].text}`,2100)
                this.showMessage(`Podemos agendar o seu horário, ${this.response[0].text} ?` ,2200)
                setTimeout(() => {
                        this.confirmQuestion(data)
                    }, 2300)


            },

            async getHours({questions}, data) {
                //TODO: get information of database
                let options = [
                    {
                        "value": "14h00",
                        "text": "14h00",
                    },
                    {
                        "value": "16h00",
                        "text": "16h00",
                    },
                    {
                        "value": "18h00",
                        "text": "18h00",
                    },
                    {
                        "value": "20h00",
                        "text": "20h00",
                    }

                ]


                const response = await this.instance.action.button({
                    action: options,
                })
                this.response.push({value: `${response.value}`, text: `${response.text}`})
                let otherQuestions = Array.from(questions)
                otherQuestions.shift()

                setTimeout(() => {
                    this.finalQuestion(otherQuestions)
                }, 1500)

            },

            async handlerSuccessExit() {
                for (const message of (this.form.positive_exit || [])) {
                    await this.showMessage(
                        message
                    )
                }
                setTimeout(() => {
                    this.finished = true
                }, 3200)
            },

            async handleErrorExit() {
                for (const message of (this.form.negative_exit || [])) {
                    await this.showMessage(
                        message
                    )
                }
                setTimeout(() => {
                    this.exited = true
                }, 3000)
            },

            replaceVariable(str) {
                const reg = /\{(.*?)\}/g
                let found

                while ((found = reg.exec(str))) {
                    if (this.form[found[1]]) {
                        str = str.replace(found[0], this.form[found[1]])
                    }
                }
                return str
            }
        }

    }

</script>

<style>
  .botui-message-content {
    float: left;
    text-align: left;
    color: #1d1d1d !important;
    background-color: #dadada !important;
  }

  .botui-message-content.human {
    color: #ffffff !important;
    background-color: #8a8a8a !important;
  }

  button.botui-actions-buttons-button {
    margin-right: 5px !important;
    margin-left: 5px !important;
  }

  .backQuestions-class {
    background-color: #c3c3c3 !important;
  }

  .profil > img.agent {
    content: none !important;
  }

  .botui-actions-buttons-button {
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
  }

  html {
    height: 100%;
  }

  body {
    min-height: 100%;
    margin: 0;
  }

  #app {
    height: 100%;
    background-color: white;
  }

  .botui {
    overflow-y: hidden;
    overflow-x: hidden;
  }

  .botui-container {
    padding-bottom: 90px;
  }

  .no-options {
    /*display: none;*/
    color: #ffffff;
  }

</style>
