import { useMemo } from 'react';
import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';

export interface ValidationError {
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

export const useSchemaValidation = (
  schemaText: string,
  output: unknown | null
): ValidationResult | null => {
  return useMemo(() => {
    if (output === null || output === undefined) return null;

    let schema: unknown;
    try {
      schema = JSON.parse(schemaText);
    } catch {
      return null;
    }

    if (typeof schema !== 'object' || schema === null) return null;

    try {
      // Remove any previously compiled schemas to avoid caching issues
      ajv.removeSchema();
      const validate = ajv.compile(schema as Record<string, unknown>);
      const valid = validate(output);

      if (valid) {
        return { valid: true, errors: [] };
      }

      const errors: ValidationError[] = (validate.errors ?? []).map((err) => ({
        path: err.instancePath || '/',
        message: err.message ?? 'Unknown validation error',
      }));

      return { valid: false, errors };
    } catch {
      // Schema itself is invalid or unsupported — skip validation
      return null;
    }
  }, [schemaText, output]);
};
