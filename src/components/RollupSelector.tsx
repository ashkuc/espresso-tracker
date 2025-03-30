import React, {useEffect} from 'react'
import { useDemo } from '@/hooks/DemoContext'
import { availableOptions, ashkucRollupConfig } from '@/chains'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const RollupSelector: React.FC = () => {
    const { l3, setL3, setL2, setL1, isConnected } = useDemo()

    const currentOption = availableOptions.find(o => o.l3.id === l3?.id)

    const onSelectChange = (value: string) => {
        const selected = availableOptions.find(o => o.l3.id.toString() === value)
        if (selected) {
            setL1(selected.l1)
            setL2(selected.l2)
            setL3(selected.l3)
        }
    }

    useEffect(() => {
        onSelectChange(ashkucRollupConfig.l3.id.toString())
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <div>
                <Label htmlFor="l3-select">Select Rollup (L3)</Label>
                <Select
                    disabled={!isConnected}
                    value={l3?.id.toString() ?? ''}
                    onValueChange={onSelectChange}
                >
                    <SelectTrigger id="l3-select">
                        <SelectValue placeholder="Choose your L3 network" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableOptions.map(option => (
                            <SelectItem key={option.l3.id} value={option.l3.id.toString()}>
                                {option.l3.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {currentOption && (
                <div className="text-sm text-muted-foreground">
                    <strong>{currentOption.l1.name}</strong> → <strong>{currentOption.l2.name}</strong> → <strong>{currentOption.l3.name}</strong>
                </div>
            )}
        </div>
    )
}
