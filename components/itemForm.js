import { Form } from 'semantic-ui-react'

const ItemForm = (props) => (
        <Form size={'tiny'} onSubmit={props.onSubmit}>
          <Form.Group>
            <Form.Input label="I will talk about..." placeholder='How we will create a product roadmap' width={'six'} name='details' value={props.details} onChange={props.onChange} />
            <Form.Input label="Minutes" width={'three'} type='number' placeholder='Amount' name='minutes' value={props.minutes}  onChange={props.onChange}/>
            <Form.Input label="Seconds" width={'three'} type='number' placeholder='Amount' name='seconds' value={props.seconds}  onChange={props.onChange} />
            <Form.Button label="Submit" content='Submit' disabled={props.disabled} />
          </Form.Group>
        </Form>
)

export default ItemForm
