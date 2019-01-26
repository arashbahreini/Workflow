import { Component, OnInit, Input, Inject } from '@angular/core';
import { WorkflowService } from '../../services/workflow.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as vkbeautify from 'vkbeautify';

@Component({
  selector: 'app-show-xml',
  templateUrl: './show-xml.component.html',
  styleUrls: ['./show-xml.component.css']
})
export class ShowXmlComponent implements OnInit {

  public xmlMessage: string;

  constructor(
    private dialogRef: MatDialogRef<ShowXmlComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.xmlMessage = vkbeautify.xml(this.data.Value);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
