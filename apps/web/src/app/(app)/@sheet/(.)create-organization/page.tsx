import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { OrganizationForm } from '../../org/organization-form'
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'

export default function CreateOrganization() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>Create organization</SheetTitle>
        </SheetHeader>

        <div className="p-4">
          <OrganizationForm />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
