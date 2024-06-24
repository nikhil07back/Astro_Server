import mongoose from "mongoose";
import fetch from 'cross-fetch';
import Price from "../../model/price/pricesetting.js";

export const addPrice = async (req, res) => {
  try {
    const data = req.body;
    console.log("Received data:", data);

    const prices = new Price({
      callPrice: data?.callPrice,
      chatPrice: data?.chatPrice,
    });
    const response = await prices.save();
    return res.status(200).json({ message: "success", data: response });
  } catch (err) {
    console.log("err", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
};

export const updatePrice = async (req, res) => {
  try {
    const data = req.body;
    const updatedPrices = await Price.findOneAndUpdate(
      {},
      {
        callPrice: data?.callPrice,
        chatPrice: data?.chatPrice,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Price updated successfully", data: updatedPrices });
  } catch (err) {
    console.log("Error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
};

export const getPrices = async (req, res) => {
  try {
    const prices = await Price.findOne();
    if (!prices) {
      return res.status(404).json({ message: "Prices not found" });
    }
    return res.status(200).json({ message: "Success", data: prices });
  } catch (err) {
    console.log("Error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
};


export const callAstrologer = async (req, res) => {
  try {
    console.log("hiiiiii");
// Find your application key and secret at dashboard.sinch.com/settings/access-keys
// Find your Sinch numbers at dashboard.sinch.com/numbers/your-numbers/numbers
const APPLICATION_KEY = process.env.SINCH_KEY;
const APPLICATION_SECRET = process.env.SECRET_KEY;
const SINCH_NUMBER = "+447520650773";
const LOCALE = "en-US";
const TO_NUMBER = "+917869464721";//"+918971227735";

const basicAuthentication = APPLICATION_KEY + ":" + APPLICATION_SECRET;

const ttsBody = {
  method: 'ttsCallout',
  ttsCallout: {
    cli: SINCH_NUMBER,
    destination: {
      type: 'number',
      endpoint: TO_NUMBER
    },
    locale: LOCALE,
    text: 'This is a call from Govind',
  }
};

fetch("https://calling.api.sinch.com/calling/v1/callouts", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Buffer.from(basicAuthentication).toString('base64')
    },
    body: JSON.stringify(ttsBody)
  }).then(ress => ress.json()).then(json => console.log(json));

    return res.status(200).json({ message: "Success", data: "" });
  } catch (err) {
    console.log("Error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
};

export async function updateUrl(callbackUrl) {
//  export const callAstrologer = async (req, res) => {
  console.log("callbackUrl-------->",callbackUrl);
  const applicationKey = process.env.SINCH_KEY;
  const applicationSecret = process.env.SINCH_KEY;
  const resp = await fetch(
    `https://callingapi.sinch.com/v1/configuration/callbacks/applications/${applicationKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(`${applicationKey}:${applicationSecret}`).toString('base64')
      },
      body: JSON.stringify({
        url: [
          {
            primary: callbackUrl
          }
        ]
      })
    }
  );
  const data = await resp.json();
  console.log(data);  
}

//async function updateUrl(callbackUrl) {
  export const incomingCall = async (req, res) => {

    console.log("svamlResponse",req);

  let svamlResponse;
  svamlResponse = {
    instructions: [
      {
        name: 'say',
        text: 'Hi, thank you for calling your Sinch number. Congratulations! You just responded to a phone call.',
        local: 'en-US'
      }
    ],
    action: {
        name: 'hangup'
    }
  };
  console.log("svamlResponse",svamlResponse);
  res.json(svamlResponse);
}