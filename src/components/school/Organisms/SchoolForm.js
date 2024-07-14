import React, { useEffect, useState } from 'react'
import Button from '../Atoms/Button'
import FormField from '../Molecules/FormField'
import {
    Box,
    Typography,
    FormControlLabel,
    Checkbox,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
} from '@mui/material'
import { getLevels } from '../../../services/api'

const SchoolForm = ({ school, errors, onChange, onSave, onCancel }) => {
    const [levels, setLevels] = useState([])

    useEffect(() => {
        const fetchLevels = async () => {
            try {
                const response = await getLevels()
                setLevels(response.data)

                if (school.levelId) {
                    onChange({ target: { value: school.levelId } }, 'levelId')
                }
            } catch (error) {
                console.error('Error fetching levels:', error)
            }
        }

        fetchLevels()
    }, [])

    const handleDateChange = (e) => {
        onChange({ target: { value: e.target.value } }, 'foundedDate')
    }

    return (
        <Box mt={2}>
            <Typography variant="h6" gutterBottom>
                {school.id ? 'Edit School' : 'Create New School'}
            </Typography>
            <FormField
                label="Name"
                value={school.name}
                onChange={(e) => onChange(e, 'name')}
                error={errors.name}
                helperText={errors.name}
                maxLength={20}
            />
            <FormField
                label="Address"
                value={school.address}
                onChange={(e) => onChange(e, 'address')}
                error={errors.address}
                helperText={errors.address}
                maxLength={40}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={school.isActive}
                        onChange={(e) => onChange(e, 'isActive')}
                    />
                }
                label="Active"
            />
            <Box mt={2} mb={2}>
                <Typography variant="body1">Founded Date</Typography>
                <TextField
                    type="date"
                    value={school.foundedDate || ''}
                    onChange={handleDateChange}
                    fullWidth
                />
            </Box>
            <FormControl component="fieldset" fullWidth margin="normal">
                <FormLabel component="legend">Level</FormLabel>
                <RadioGroup
                    value={school.levelId ? String(school.levelId) : ''}
                    onChange={(e) =>
                        onChange(
                            { target: { value: parseInt(e.target.value, 10) } },
                            'levelId'
                        )
                    }
                >
                    {Array.isArray(levels) &&
                        levels.map((level) => (
                            <FormControlLabel
                                key={level.id}
                                value={String(level.id)}
                                control={<Radio />}
                                label={level.name}
                            />
                        ))}
                </RadioGroup>
            </FormControl>
            <Box mt={2}>
                <Button variant="contained" color="primary" onClick={onSave}>
                    Save
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={onCancel}
                    style={{ marginLeft: '10px' }}
                >
                    Cancel
                </Button>
            </Box>
        </Box>
    )
}

export default SchoolForm
