const express = require ('express')
const server = express ()

server.use(express.json())
server.use((request, response, next) => {
    console.log('controle de estoque da empresa ABC')
    return next ()
})
const produto = [
    {id: 2, nome: 'Dlore', qtd: 2, valor_u: 30000}
]
const check_id = (request, response, next) =>{
    const id = request.params.id 
    const recebe_C = produto.find(v_produto => {
        return v_produto.id == id
    })   
    if (recebe_C === undefined){
        return response.status(400).json({erro:'Não existe produto com este id.'})
    }
    return next()
}
for (let i= 0; i < produto.length; i++){
    produto[i].preco_t = produto[i].qtd * produto[i].valor_u
    produto[i].preco_v = produto[i].valor_u + produto[i].valor_u * 0.2
    produto[i].lucro = produto[i].preco_v - produto[i].valor_u
    if (produto[i].qtd < 50){
        produto[i].situacao = 'A situação é estável'
    } else if ( produto[i].qtd >= 50 && produto[i].qtd < 100){
        produto[i].situacao = 'A situação é boa'
    } else if (produto[i].qtd > 100){
        produto[i].situacao = 'A situação é excelente'
    }
}
function calc(produto) {
    for (let i = 0; i < produto.length; i++) {
      produto[i].preco_t = produto[i].qtd * produto[i].valor_u
      produto[i].preco_v = produto[i].valor_u * 1.2
      produto[i].lucro = produto[i].preco_v - produto[i].valor_u
      if (produto[i].qtd < 50) {
        produto[i].situacao = 'A situação do produto é estável'
      } else if (produto[i].qtd >= 50 && produto[i].qtd < 100
      ) {
        produto[i].situacao = 'A situação do produto é boa'
      } else if (produto[i].qtd >= 100) {
        produto[i].situacao = 'A situação do produto é excelente'
      }
    }
  }
function check_c(request, response, next) {
    const { id, nome_produto, qtd, valor_u } = request.body;
    if(id === '' || nome_produto == '' || qtd === ''|| valor_u === '') {
      return response.status(400).json({ mensagem: 'O campo id do produto ou nome do produto ou quantidade ou valor unitario ou complemento não existe no corpo da requisição' })
    }
    return next()
  }
server.get('/produtos', (request, response) => {
    return response.json(produto)
})
server.get('/produtos/:id', check_id, (request, response) => {
    const id = request.params.id
    const peneira = produto.filter (galo => {
        return galo.id == id
    })
    return response.json (peneira)
})
server.post('/produtos', check_c, (request, response) => {
    produto.push(request.body)
    const ultimo_p = produto[produto.length - 1]
    calc(produto)
    return response.json(ultimo_p)
  })
  
  server.put('/produtos', check_c, (request, response) => {
    const id = request.body.id
    let indice = 0
    let produto_f = produto.filter( (produto, index) => {
      if(produto.id === id) {
        indice = index
        return produto.id === id
      }
    })
  
    if(produto_f.length === 0) {
      return response.status(400).json({ mensagem: 'Não existe produto com este id'})
    }
    produto[indice] = request.body
    return response.json(produto)
  })
  
  
  server.delete('/produtos',(request, response) => {
    const id = request.body.id
    const produto_f = produto.find( (prod, index) => {
      if(prod.id == id) {
        produto.splice(index, 1)
        return prod.id == id
      }
    })
    if(!produto_f) {
      return response.status(400).json({ mensagem: 'Não existe produto com este id'})
    }
  
    return response.json(produto)
  })
  
  server.post('/produtos/:id/complemento', check_id, (request, response) => {
    const comp = request.body.complemento
    const id = request.params.id;
    for(let i = 0; i < produto.length; i++) {
      if(produto[i].id === Number(id)) {
        produto[i].comp.push(comp)
      }
    }
    return response.json(produto)
  })
server.listen (3333)