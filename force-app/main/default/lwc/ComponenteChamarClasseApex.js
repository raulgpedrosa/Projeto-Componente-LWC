import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import doPostContractData from '@salesforce/apex/ApiPostContractsNetLex.doPostContractData';

export default class CallApexMethodButton extends LightningElement {
    @api recordId; // Este é o ID do registro atual
    @track isLoading = false; // Usar o decorator @track para acompanhar a variável isLoading
    @track responseMessage = ''; // Armazenar a mensagem de retorno da chamada

    callApexMethod() {
        this.isLoading = true; // Define o estado para "carregando"

        const timestamp = new Date().getTime(); // Obtém o carimbo de data/hora atual
        doPostContractData({ contractId: this.recordId, timestamp: timestamp })
            .then(result => {
                console.log('Apex method called successfully:', result);
                console.log('Result object:', result);
                if (result === 200) { // Use === para comparar o status code
                    this.responseMessage = 'Dados enviados com sucesso!';
                    this.showSuccessToast(); // Mostra o toast de sucesso
                } else {
                    this.responseMessage = 'Erro na integração. Verifique o preenchimento dos dados necessários para o envio.';
                    this.showErrorToast(); // Mostra o toast de erro
                }
            })
            .catch(error => {
                console.error('Error calling Apex method:', error);
                this.responseMessage = 'Erro na conexão com o servidor da Netlex. Tente novamente. ';
                this.showErrorToast(); // Mostra o toast de erro
            })
            .finally(() => {
                this.isLoading = false; // Redefine o estado após a chamada
                this.forceRefreshView(); // Atualiza a visualização
            });
    }

    showSuccessToast() {
        const evt = new ShowToastEvent({
            title: 'Sucesso',
            message: this.responseMessage,
            variant: 'success',
        });
        this.dispatchEvent(evt);
    }

    showErrorToast() {
        const evt = new ShowToastEvent({
            title: 'Erro',
            message: this.responseMessage,
            variant: 'error',
        });
        this.dispatchEvent(evt);
    }

    forceRefreshView() {
        const refreshEvent = new CustomEvent('forcerefresh');
        this.dispatchEvent(refreshEvent);
    }
}