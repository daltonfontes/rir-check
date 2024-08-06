import axios from "axios";
import moment from "moment-timezone";
import chalk from "chalk";
import figlet from "figlet";

const URL = "https://www.ticketmaster.com.br/static/rock-in-rio";
const TIME_VERIFY = 30 * 60 * 1000;
const TIME_BOX = moment.tz('2024-08-06 12:00', 'America/Sao_Paulo');

const info = chalk.blue;
const success = chalk.green;
const warning = chalk.yellow;
const error = chalk.red;

async function checkAvailability() {
  try {
    const resposta = await axios.get(URL);
    if (resposta.status === 200) {
      if (resposta.data.includes("Ingressos disponíveis")) {
        return true;
      }
    }
    return false;
  } catch (erro) {
    console.error(error(`Erro ao acessar o site: ${erro.message}`));
    return false;
  }
}

async function main() {

  figlet('Rock in Rio Checker', function (err, data) {
    if (err) {
      console.error(error('Erro ao gerar ASCII art.'));
      console.dir(err);
      return;
    }
    console.log(info(data));
    console.log(info("Iniciando verificação de disponibilidade de ingressos..."));
  });

  const hour = moment().tz('America/Sao_Paulo').format('HH:mm:ss');

  while (moment().tz('America/Sao_Paulo').isBefore(TIME_BOX)) {
    if (await checkAvailability()) {
      console.log(success("Ingressos disponíveis! Acesse o site para comprar: ") + chalk.underline.blue(URL));
      break;
    } else {
      console.log(warning(`[${hour}] Ingressos não disponíveis. Próxima verificação em ${TIME_VERIFY / 1000 / 60} minutos.`));
    }
    await new Promise(resolve => setTimeout(resolve, TIME_VERIFY));
  }

  if (moment().tz('America/Sao_Paulo').isSameOrAfter(TIME_BOX)) {
    console.log(info("Tempo limite atingido. O script foi encerrado."));
  }
}

main().catch(erro => console.error(error(`Erro no script: ${erro.message}`)));
