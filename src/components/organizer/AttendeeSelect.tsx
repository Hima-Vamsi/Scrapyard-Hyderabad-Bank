import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Attendee {
    name: string;
    email: string;
    account: number;
}

interface PickAttendeeProps {
    onSelect: (email: string, name: string) => void;
}

const PickAttendee: React.FC<PickAttendeeProps> = ({ onSelect }) => {
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [formData, setFormData] = useState<{ name: string; email: string }>({
        name: '',
        email: '',
    });

    useEffect(() => {
        const fetchAttendees = async () => {
            try {
                const response = await fetch('/api/public/util/retrieve-attendees');
                const data = await response.json();
                const filteredAttendees = data.filter((attendee: any) => attendee.account === 0);
                setAttendees(filteredAttendees);
            } catch (error) {
                console.error('Failed to fetch attendees', error);
            }
        };

        fetchAttendees();
    }, []);

    const handleChange = (
        value: { value: string; label: string } | null,
        field?: string
    ) => {
        if (value) {
            const selectedAttendee = attendees.find((attendee) => attendee.name === value.value) || null;
            if (selectedAttendee) {
                setFormData({ name: selectedAttendee.name, email: selectedAttendee.email });
                onSelect(selectedAttendee.email, selectedAttendee.name);
            }
        }
    };

    const attendeeOptions = attendees.map((attendee) => ({
        value: attendee.name,
        label: attendee.name,
    }));

    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: 'white',
        }),
        input: (provided: any) => ({
            ...provided,
            color: 'white',
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: 'rgba(255, 255, 255, 0.5)',
        }),
        menu: (provided: any) => ({
            ...provided,
            backgroundColor: 'black',
            border: '1px solid grey',
        }),
        menuList: (provided: any) => ({
            ...provided,
            backgroundColor: 'black',
        }),
        option: (provided: any, state: { isFocused: boolean }) => ({
            ...provided,
            backgroundColor: state.isFocused ? 'rgba(255, 255, 255, 0.1)' : 'black',
            color: 'white',
        }),
    };

    return (
        <>
            <div className="space-y-4">
                <Label htmlFor="name" className="sr-only">
                    Name
                </Label>
                <Select
                    name="name"
                    value={attendeeOptions.find((option) => option.value === formData.name)}
                    onChange={(value) => handleChange(value, 'name')}
                    options={attendeeOptions}
                    classNamePrefix="react-select"
                    placeholder="Select a name"
                    styles={customStyles}
                />
            </div>
            <div className="space-y-4">
                <Label htmlFor="email" className="sr-only">
                    Email
                </Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    readOnly
                    className="border-white/10 bg-white/5 text-white placeholder:text-white/50 rounded-[6px]"
                />
            </div>
        </>
    );
};

export default PickAttendee;
