
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
            paper: '#1e1e1e',
        },
        primary: {
            main: '#569cd6',
        },
        text: {
            primary: '#d4d4d4',
            secondary: '#858585',
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
                    backgroundColor: '#1e1e1e',
                    color: '#d4d4d4',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: { backgroundImage: 'none' },
            },
        },
        MuiTextField: {
            defaultProps: { variant: 'outlined', size: 'small' },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    fontSize: '0.85rem',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#569cd6' },
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: '#555',
                    '&.Mui-checked': { color: '#569cd6' },
                },
            },
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1e1e1e',
                    '&:before': { display: 'none' },
                    border: '1px solid #333',
                    borderRadius: '4px',
                },
            },
        },
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    minHeight: 36,
                    '&.Mui-expanded': { minHeight: 36, borderBottom: '1px solid #333' },
                },
                content: {
                    margin: '6px 0',
                    '&.Mui-expanded': { margin: '6px 0' },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: { textTransform: 'none', fontSize: '0.8rem' },
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
            <CssBaseline />
            <Box
                sx={{
                    height: '100%',
                    overflowY: 'auto',
                    backgroundColor: '#1e1e1e',
                    color: '#d4d4d4',
                    px: 2,
                    py: 1.5,
                    '& .MuiGrid2-root': { gap: '4px' },
                    '& .MuiFormLabel-root': { color: '#d4d4d4' },
                    '& .MuiFormHelperText-root': { color: '#858585' },
                    '& .MuiTypography-root': { color: '#d4d4d4' },
                    '& .MuiInputBase-input': { color: '#d4d4d4' },
                    '& fieldset > legend': { color: '#d4d4d4' },
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        color: '#d4d4d4',
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