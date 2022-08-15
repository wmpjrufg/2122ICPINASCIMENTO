function ANCORAGEM() {	
	/*
	Esta função determina o comprimento de ancoragem de uma barra de aço em concreto.
	*/

	//const NORMA = "NBR 6118";
	const NORMA = document.getElementById("norma").value;
	const ETA_1 = document.getElementById("tipo_1").value;
	const ETA_2 = document.getElementById("tipo_2").value;
	var F_CK = document.getElementById("f_ck").value;
	const F_YK = document.getElementById("f_yk").value;
	var BIT = document.getElementById("bitola").value;
	const AS_CALC = document.getElementById("a_calc").value;
	const AS_EF = document.getElementById("a_efet").value;
	const ALPHA_AUX = document.getElementById("gancho").value;

	// Cálculo do comprimento de ancoragem conforme item 9.3.2.1 da NBR 6118 (2014)
    if (NORMA == 'NBR 6118') {
        // Cálculo do fator η_1 
        if (ETA_1 == 'LISA') {
            N_1 = 1;
		} else if (ETA_1 == 'ENTALHADA') {
            N_1 = 1.40;
		} else if (ETA_1 == 'NERVURADA') {
            N_1 = 2.25;
        }
        //Cálculo do fator η_2
        if (ETA_2 == 'BOA') {
            N_2 = 1.00;
		} else if (ETA_2 == 'MA') {
            N_2 = 0.70;
        }
        //Cálculo do fator η_3
        BIT *= 1000;                 //Conversão m para mm
        if (BIT <= 32) {
            N_3 = 1.00;
		} else if (BIT > 32) {
            N_3 = (132 - BIT) / 100;
        }
        BIT /= 1000;                 //Conversão mm para m

        // Resistência de cálculo do concreto à tração direta (f_ctd)
        F_CK /= 1000;                // Conversão kPa para MPa 
        F_CTM = 0.3 * Math.pow(F_CK, (2 / 3));
        F_CTM *= 1000;               // Conversão MPa para kPa 
        F_CTKINF = 0.70 * F_CTM;
        GAMMA_C = 1.40;
        F_CTD = F_CTKINF / GAMMA_C;
        F_CK *= 1000;                // Conversão MPa para kPa 
        
        // Resistência de aderência de cálculo(f_bd)
        F_BD = N_1 * N_2 * N_3 * F_CTD;
        
        // Comprimento de ancoragem básico (l_b)
        F_YD = F_YK / 1.15;
        L_BAUX = (BIT / 4) * (F_YD / F_BD);
        L_BMIN = 25 * BIT;
        L_B = Math.max(L_BAUX, L_BMIN);

        // Comprimento de ancoragem necessário (l_bnec)
        if (ALPHA_AUX == 'SIM') {
            ALPHA = 0.70;
		} else  if (ALPHA_AUX == 'NÃO') {
            ALPHA = 1.00;
        }
        L_BNECAUX = ALPHA * L_B *(AS_CALC / AS_EF);

        // Comprimento de ancoragem mínimo (l_cnecmin)
        L_BNECMIN1 = 0.3 * L_B;
        L_BNECMIN2 = 10 * BIT;
        L_BNECMIN3 = 0.10;
        L_BNECMIN = Math.max(L_BNECMIN1, L_BNECMIN2, L_BNECMIN3);

        // Comprimento de ancoragem utilizado (L_BNEC)
        L_BNEC = Math.max(L_BNECMIN, L_BNECAUX);
		
		// Processamento
		document.querySelector('#n_1').textContent = 'eta_1: '+ ETA_1;
		document.querySelector('#n_2').textContent = 'eta_2: ' + ETA_2;
		document.querySelector('#f_ctm').textContent = 'f_ctm: ' + F_CTM + ' kPA';
		document.querySelector('#f_ctinf').textContent = 'f_ctinf: ' + F_CTKINF + ' kPA';
		document.querySelector('#f_ctd').textContent = 'f_ctd: ' + F_CTD + ' kPA';
		document.querySelector('#f_bd').textContent = 'f_bd: ' + F_BD + ' kPA';
		
		// Resultado final
		document.querySelector('#l_bas').textContent = 'l_bas: ' + L_BAUX + ' m';
		document.querySelector('#l_bmin').textContent = 'l_bmin: ' + L_BMIN + ' m';
		document.querySelector('#l_b').textContent = 'l_b: ' + L_B + ' m';
		document.querySelector('#l_necaux').textContent = 'l_necaux: ' + L_BNECAUX + ' m';
		document.querySelector('#l_necmin').textContent = 'l_necmin: ' + L_BNECMIN + ' m';
		document.querySelector('#l_bnec').textContent = 'l_bnec: ' + L_BNEC + ' m';
	}
}

// Função de chamada do clique do botão
const PROCESSAR = document.getElementById("calcular");
PROCESSAR.addEventListener('click', ANCORAGEM);