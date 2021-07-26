var lista = [];

// validação do cadastro

  function validarCadastro(e) {
    e.preventDefault()
    
    //pegando somente os valores dos objetos através da ID
    var tipo = document.getElementById("tipo").value;
    var nome = document.getElementById("nome").value;
    var valor = document.getElementById("valor").value;

    var error_mercadoria = document.getElementById("error_mercadoria");
    error_mercadoria.innerHTML = "";
    var error_valor = document.getElementById("error_valor");
    error_valor.innerHTML = "";
    var error_tipo = document.getElementById("error_tipo");
    error_tipo.innerHTML = "";

  //verificaçao dos campos caso estiverem vazio, emitir uma mensagem 
    var existe_error = false;

    if(nome == "") {
      existe_error = true;
      error_mercadoria.innerHTML = "Preencha o nome";
    }

    if(valor == "") {
      existe_error = true;
      error_valor.innerHTML = "Preencha o valor";
    }

    if(tipo == "") {
      existe_error = true;
      error_tipo.innerHTML = "Preencha o tipo";
    }

  //apos a validaçao, armazenar dados na local storage

    if(!existe_error) {                        
      if(lista == null){
          lista = [];
    }

    if(tipo =="compra"){
      valor = valor*-1; 
    }else{
      valor = parseFloat(valor); 
  }

    lista.push({nome:nome, valor:valor, tipo: tipo})  
    localStorage.setItem('lista', JSON.stringify(lista))

  // deixa os campos vazios apos submeter uma transaçao

    document.getElementById("nome").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("tipo").value = "";
    }

    return false;
  }

  //trazer o cadastro para o extrato de transaçoes
  //obs:o extrato nao esta atualizando. Só funciona quando recarrega o navegador manualmente

  function listaExtrato() {
    lista = JSON.parse(localStorage.getItem('lista')) 

    document.getElementsByClassName('table-data').innerHTML = '';

    var total = 0;
    for (let idx_aln in lista) {

    total += parseFloat(lista[idx_aln].valor);
    document.getElementById('table-data').innerHTML += 

    `<div>
    <td>` + lista[idx_aln].nome + `</td>
    <td>` + lista[idx_aln].valor + `</td>
    <tr>
      <td class="border" colspan="2"></td>
    </tr>                   
    </div>`
  }

    document.getElementById('table-total').innerHTML += 
    `<td>TOTAL:</td>
     <td>` + total + `</td>`;
}
  listaExtrato();


  // mascara de moeda

 function formatarMoeda () {
   var elemento = document.getElementById ('valor');
   var valor = elemento.value;

  valor = valor + '';
  valor = parseInt(valor.replace(/[\D]+/g, ''));
  valor = valor + '';
  valor = valor.replace(/([0-9]{2})$/g, ",$1");

  if (valor.length > 6) {
     valor = valor.replace(/([0-9]{3}), ([0-9]{2}$)/g, ".$1,$2");
   }

  elemento.value = valor;
  if (valor == 'NaN') elemento.value = '';

}

  // menu limpar dados

  function limparDados() {
    var mensagem = confirm("Deseja limpar o extrato de transações?");
    if(mensagem == true) {
      localStorage.clear();
      window.location.reload();
    }
  }

  // salvar dados na API *create

  var salvarTransacao = JSON.stringify(localStorage.getItem('table-data'));

  function salvarServidor() {
    var salvar = confirm("Deseja salvar o extrato no servidor?");
    if(salvar == true) {

      fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
        method: "POST",
        headers: {
          Authorization: 'Bearer key2CwkHb0CKumjuM',
          'Content-type': 'application/json',
        },
        body: JSON.stringify ({
          records: [{
            fields: {
              Aluno: '6813',
              Json: salvarServidor
            }
          }]
        })

      })
    }
  }
