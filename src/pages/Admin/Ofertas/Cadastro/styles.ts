import styled from "@emotion/styled";

export const Cadastro = styled.div`
display: flex;
align-items: center;
justify-content: center;

.contentMain form{
    margin-top: 15px;
    display: flex;
    flex-direction: column;

    .porcentagem{
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 15px;

        input{
            width: 350px;
        }
    }
    .produtosSearch{
        flex-wrap: nowrap;
        overflow-y: scroll;
        height: 40vh ;
        width: 50vw ;

    }
    Button{
        margin-top: 15px;
    }
}


    .produtosSearch::-webkit-scrollbar {
        height:  8px;
    }
    .produtosSearch::-webkit-scrollbar-track {/* Background */
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 10px;
        background-color: #F5F5F5;
    }
    .produtosSearch::-webkit-scrollbar-thumb  { 
        border-radius: 10px;
        background-color: #0d6efd ;
        width: 5px ;
    }
    .produtosSearch::-webkit-scrollbar-thumb:hover{
        background-color:  #0b5ed7;
    }
`