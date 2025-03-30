import React, {useMemo, useState} from 'react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {ethers} from 'ethers'
import {useAccount} from 'wagmi'
import {cn} from '@/lib/utils'

const exampleAddresses = [
    '0xC33dFC10d472D8B78cdd71B3417dF1cE8Ad8f18D',
    '0xeb84a5B6437C52EbF80ab1561394E843a8588B1c',
    '0xa43030b2AB8cE318EefB8de56DAfC3f31e850A88',
]

type RecipientSelectorProps = {
    value: string
    onChange: (value: string, isValid: boolean) => void
}

export const RecipientSelector: React.FC<RecipientSelectorProps> = ({value, onChange}) => {
    const [mode, setMode] = useState<'select' | 'custom'>('select')
    const [customAddress, setCustomAddress] = useState('')
    const [isValid, setIsValid] = useState(true)

    const {addresses: connectedAddresses} = useAccount()

    const options = useMemo(() => {
        const unique = new Set([
            ...exampleAddresses.map((a) => a.toLowerCase()),
            ...(connectedAddresses ?? []).map((a) => a.toLowerCase()),
        ])

        if (value && mode === 'select') unique.delete(value.toLowerCase())
        return Array.from(unique)
    }, [connectedAddresses, value, mode])

    const handleSelectChange = (selected: string) => {
        if (selected === 'custom') {
            setMode('custom')
            setCustomAddress('')
            setIsValid(false)
            onChange('', false)
        } else {
            setMode('select')
            setIsValid(true)
            onChange(selected, true)
        }
    }

    const handleInputChange = (v: string) => {
        setCustomAddress(v)
        const valid = ethers.utils.isAddress(v)
        setIsValid(valid)
        onChange(v, valid)
    }

    return (
        <div className="space-y-2">
            <Label>Recipient</Label>

            <Select value={value} onValueChange={handleSelectChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Select address">
                        {mode === 'custom' ? mode : value}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {options.map((addr) => (
                        <SelectItem key={addr} value={addr}>
                            {addr.slice(0, 6)}...{addr.slice(-4)}
                        </SelectItem>
                    ))}
                    <SelectItem value="custom">Custom address...</SelectItem>
                </SelectContent>
            </Select>

            {mode === 'custom' && (
                <>
                    <Input
                        placeholder="Enter address"
                        value={customAddress}
                        onChange={(e) => handleInputChange(e.target.value)}
                        className={cn({'border-red-500': !isValid})}
                        aria-invalid={!isValid}
                    />
                    {!isValid && (
                        <p className="text-xs text-red-500">Invalid address</p>
                    )}
                </>
            )}
        </div>
    )
}
