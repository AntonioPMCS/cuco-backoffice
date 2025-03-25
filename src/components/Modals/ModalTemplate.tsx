import React from 'react'
import { Dialog, DialogContent, DialogClose, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';

interface ModalTemplateProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  title: string;
  handler: (arg0?:any) => void;
  description?: string;
}

const ModalTemplate: React.FC<ModalTemplateProps> = ({children, trigger, title, handler, description}) => {

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            {trigger}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {title}
            </DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>  
          <div className="grid gap-4 py-4">
            {children}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handler}>Add Device</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent> 
      </Dialog>
    </>
  )
}

export default ModalTemplate
