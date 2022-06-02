import axios from "axios";
import * as Cheerio from "cheerio";
const getHtml = async () => {
  try {
    return await axios.get(
      `https://www.applyhome.co.kr/ai/aib/selectSubscrptCalenderView.do#a`
    );
  } catch (error) {
    console.error(error);
  }
};

getHtml().then((html) => {
  console.log(html);
  const $ = Cheerio.load(html.data);
  $.html();
});
