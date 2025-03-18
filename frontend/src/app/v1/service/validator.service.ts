import { Injectable } from '@angular/core';
import { TypeEnum } from '../enum/Type';
import { Validators } from '@angular/forms';
import { UrlValidator } from '../validator/url.validator';
import { DecimalValidator } from '../validator/decimal.validator';
import { NumericValidator } from '../validator/numeric.validator';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  static validatorByTypeId(typeId: number) {
    switch (typeId) {
      case TypeEnum.LABEL:
        return [Validators.maxLength(255)];
      
      case TypeEnum.TEXT:
        return [Validators.maxLength(65535)];
      
      case TypeEnum.URL:
        return [Validators.maxLength(4096), UrlValidator()];

      case TypeEnum.BOOLEAN:
        return [];
      
      case TypeEnum.NUMBER:
        return [Validators.min(-9999999999), Validators.max(9999999999), DecimalValidator()];
      
      case TypeEnum.MONEY:
        return [NumericValidator()];
      
      case TypeEnum.DATE:
        return [Validators.min(0)];

      case TypeEnum.IMAGE:
        return [];

      case TypeEnum.FORM:
        return [];

      case TypeEnum.ENUMERATOR:
        return [];
    }
    
    console.warn("NOT IMPLEMENTED ERROR", typeId);

    throw new Error("NOT IMPLEMENTED ERROR");
  }
}
