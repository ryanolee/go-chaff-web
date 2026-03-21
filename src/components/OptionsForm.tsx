
import schema from '@go/schemas/GoChaffGeneratorConfig.json';
import validator from '@rjsf/validator-ajv8';
import type { IChangeEvent } from '@rjsf/core';
import type { RJSFSchema } from '@rjsf/utils';
import { withTheme } from '@rjsf/core';
import { Theme } from '@rjsf/mui';
import { createTheme, ThemeProvider, CssBaseline, Box, Typography } from '@mui/material';
import type { GoChaffGeneratorConfig } from '@go/types/GoChaffOptions';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#1e1e1e',
            paper: '#252525',
        },
        primary: {
            main: '#569cd6',
        },
        secondary: {
            main: '#4ec9b0',
        },
        text: {
            primary: '#e0e0e0',
            secondary: '#999',
        },
        divider: '#333',
    },
    typography: {
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        fontSize: 13,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: 'transparent',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                size: 'small',
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    fontSize: '0.85rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#333',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#569cd6',
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: '0.85rem',
                },
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    color: '#999',
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: '#555',
                    '&.Mui-checked': {
                        color: '#569cd6',
                    },
                },
            },
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1e1e1e',
                    borderRadius: '4px',
                    '&:before': {
                        display: 'none',
                    },
                    border: '1px solid #333',
                },
            },
        },
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    minHeight: 36,
                    '&.Mui-expanded': {
                        minHeight: 36,
                        borderBottom: '1px solid #333',
                    },
                },
                content: {
                    margin: '6px 0',
                    '&.Mui-expanded': {
                        margin: '6px 0',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontSize: '0.8rem',
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: '#e0e0e0',
                },
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    fontSize: '0.7rem',
                    color: '#777',
                },
            },
        },
    },
});

const Form = withTheme(Theme);

interface OptionsFormProps {
    onChange?: (data: GoChaffGeneratorConfig) => void;
}

export const OptionsForm = ({ onChange }: OptionsFormProps) => {
    const handleChange = (e: IChangeEvent) => {
        if (onChange && e.formData) {
            onChange(e.formData as GoChaffGeneratorConfig);
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline enableColorScheme />
            <Box
                sx={{
                    height: '100%',
                    overflowY: 'auto',
                    px: 2,
                    py: 1.5,
                    '& .MuiGrid2-root': {
                        gap: '4px',
                    },
                    '& fieldset > legend': {
                        color: '#e0e0e0',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                    },
                    '& .field-description': {
                        fontSize: '0.75rem',
                        color: '#777',
                        mb: 0.5,
                    },
                }}
            >
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 600,
                        color: '#e0e0e0',
                        mb: 1,
                        pb: 0.75,
                        borderBottom: '1px solid #333',
                        letterSpacing: '0.02em',
                    }}
                >
                    Generator Options
                </Typography>
                <Form
                    schema={schema as RJSFSchema}
                    validator={validator}
                    onChange={handleChange}
                    liveValidate={true}
                    showErrorList={'top'}
                    initialFormData={{}}
                >
                    {/* Hide default submit button — the parent "Process" button handles it */}
                    <></>
                </Form>
            </Box>
        </ThemeProvider>
    );
};