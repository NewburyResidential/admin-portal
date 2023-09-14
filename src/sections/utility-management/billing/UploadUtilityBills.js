import UploadMultiFiles from 'src/components/upload-files/UploadMultiFiles';
import { useState } from 'react';
import data from 'public/data.json';
import {
  fConverToNumber,
  fCurrency,
  fNumber,
  fShortenNumber,
  fTwoDecimals,
} from 'src/utils/format-number';

export default function UploadUtilityBills({ setData }) {
  console.log(data);

  function toCamelCase(str) {
    return str
      .split(' ')
      .map((word, index) => {
        if (index === 0) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');
  }

  const transformedData = (obj) => {
    let newObj = {};
    for (const key in obj) {
      const camelCaseKey = toCamelCase(key);
      let value = obj[key].content || null;
      if (value ? obj[key].kind === 'number' : false) {
        value = fConverToNumber(value);
      }
      newObj[camelCaseKey] = {
        value,
        confidence: obj[key].confidence,
      };
    }
    newObj.totalAmount = {
      value: 4186.82,
      confidence: 1,
    };
    return newObj;
  };

  let transformed = transformedData(data);
  console.log(transformed);




  const calculateSalesTax = () => {
    const gasExists = Boolean(transformed.gasMeterNumber.value);
    const electricExists = Boolean(transformed.electricMeterNumber.value);
  
    let gasBeforeTax = transformed.totalNaturalGas.value;
    let electricBeforeTax = transformed.totalElectric.value;
    let totalAfterTax = transformed.totalAmount.value;

    const setTaxValues = (type, taxAmount) => {
      transformed[type].value = fTwoDecimals(taxAmount + (type === 'totalNaturalGas' ? gasBeforeTax : electricBeforeTax));
      transformed[type + 'Tax'] = {
        value: fTwoDecimals(taxAmount),
        confidence: Math.min(transformed.totalAmount.confidence, transformed[type].confidence),
      };
    };
  
    if (gasExists && electricExists) {
      const totalBeforeTax = gasBeforeTax + electricBeforeTax;
      const totalSalesTax = totalAfterTax - totalBeforeTax;
      const gasTax = (gasBeforeTax / totalBeforeTax) * totalSalesTax;
      const electricTax = (electricBeforeTax / totalBeforeTax) * totalSalesTax;
  
      setTaxValues('totalNaturalGas', gasTax);
      setTaxValues('totalElectric', electricTax);
    } else if (gasExists) {
      const gasTax = totalAfterTax - gasBeforeTax;
      setTaxValues('totalNaturalGas', gasTax);
    } else if (electricExists) {
      const electricTax = totalAfterTax - electricBeforeTax;
      setTaxValues('totalElectric', electricTax);
    }
  };

  calculateSalesTax();
  console.log(transformed);


  const acceptedFiles = {
    'image/png': ['.png'],
    'image/png': ['.jpg', '.jpeg'],
    'application/pdf': ['.pdf'],
  };

  const onUpload = async (files) => {
    console.log(files);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/formRecognizer', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        //setData(responseData.documentResponses)
        console.log('Response data:', responseData);
      } else {
        const responseData = await response.json();
        console.log(responseData);
      }
    } catch (err) {
      console.error('Error uploading files:', err);
    }
  };

  return (
    <>
      <UploadMultiFiles onUpload={onUpload} accept={acceptedFiles} />
    </>
  );
}
